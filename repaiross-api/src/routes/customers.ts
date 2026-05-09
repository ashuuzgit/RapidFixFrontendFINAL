import { Hono } from 'hono';
import { AppContext, requireAuth, requireOwner } from '../middleware/auth';
import { db } from '../type/lib/db';

const customers = new Hono<AppContext>();

// GET /customers?search=...&page=1&limit=20
customers.get('/', requireAuth, async (c) => {
	const supabase = db(c.env);
	const search = c.req.query('search') ?? '';
	const page = Number(c.req.query('page') ?? 1);
	const limit = Number(c.req.query('limit') ?? 20);
	const from = (page - 1) * limit;

	let query = supabase
		.from('customers')
		.select('id, name, phone, email, whatsapp_opt_in, created_at', { count: 'exact' })
		.range(from, from + limit - 1)
		.order('created_at', { ascending: false });

	if (search) {
		query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
	}

	const { data, error, count } = await query;
	if (error) return c.json({ error: error.message }, 500);
	return c.json({ data, total: count, page, limit });
});

// POST /customers
customers.post('/', requireOwner, async (c) => {
	const supabase = db(c.env);
	const body = await c.req.json();

	const { data, error } = await supabase
		.from('customers')
		.insert({
			name: body.name,
			phone: body.phone,
			email: body.email ?? null,
			whatsapp_opt_in: body.whatsapp_opt_in ?? true,
		})
		.select()
		.single();

	if (error) {
		if (error.code === '23505') return c.json({ error: 'Phone number already registered' }, 409);
		return c.json({ error: error.message }, 500);
	}
	return c.json(data, 201);
});

// GET /customers/lookup?phone=9876543210
// NOTE: must stay above /:id so Hono doesn't treat "lookup" as an id param
customers.get('/lookup', requireAuth, async (c) => {
	const phone = c.req.query('phone')?.trim();

	if (!phone) return c.json({ error: 'phone query param is required' }, 400);

	const supabase = db(c.env);

	const { data, error } = await supabase
		.from('customers')
		.select('id, name, phone, email, whatsapp_opt_in')
		.eq('phone', phone)
		.maybeSingle();

	if (error) return c.json({ error: error.message }, 500);
	if (!data) return c.json({ found: false }, 200);

	return c.json({ found: true, customer: data });
});

// GET /customers/:id  — returns customer + vehicles + recent jobs
customers.get('/:id', requireAuth, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');

	const [customerRes, vehiclesRes, jobsRes] = await Promise.all([
		supabase.from('customers').select('*').eq('id', id).single(),
		supabase.from('vehicles').select('*').eq('customer_id', id).order('created_at', { ascending: false }),
		supabase
			.from('jobs')
			.select('id, status, created_at, mechanic_id, vehicles(make, model, registration)')
			.eq('customer_id', id)
			.order('created_at', { ascending: false })
			.limit(10),
	]);

	if (customerRes.error) return c.json({ error: 'Customer not found' }, 404);
	return c.json({
		...customerRes.data,
		vehicles: vehiclesRes.data ?? [],
		recent_jobs: jobsRes.data ?? [],
	});
});

// PATCH /customers/:id
customers.patch('/:id', requireOwner, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');
	const body = await c.req.json();

	const allowed = ['name', 'email', 'whatsapp_opt_in'];
	const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
	for (const key of allowed) {
		if (key in body) updates[key] = body[key];
	}

	const { data, error } = await supabase.from('customers').update(updates).eq('id', id).select().single();

	if (error) return c.json({ error: error.message }, 500);
	return c.json(data);
});

// GET /customers/:id/messages — conversation thread
customers.get('/:id/messages', requireOwner, async (c) => {
	const supabase = db(c.env);
	const customerId = c.req.param('id');

	const { data, error } = await supabase
		.from('messages')
		.select('*')
		.eq('customer_id', customerId)
		.order('created_at', { ascending: true });

	if (error) return c.json({ error: error.message }, 500);
	return c.json(data);
});

// POST /customers/:id/messages — send outbound WhatsApp
customers.post('/:id/messages', requireOwner, async (c) => {
	const supabase = db(c.env);
	const customerId = c.req.param('id');
	const { body: msgBody } = await c.req.json();

	const { data: customer } = await supabase.from('customers').select('phone, whatsapp_opt_in').eq('id', customerId).single();

	if (!customer) return c.json({ error: 'Customer not found' }, 404);
	if (!customer.whatsapp_opt_in) return c.json({ error: 'Customer has opted out of WhatsApp' }, 422);

	const { data: location } = await supabase.from('locations').select('wa_number_id, wa_access_token').eq('active', true).limit(1).single();

	if (!location?.wa_number_id) return c.json({ error: 'WhatsApp not configured' }, 500);

	const { waSendText } = await import('../type/lib/whatsapp');
	await waSendText({
		waNumberId: location.wa_number_id,
		accessToken: location.wa_access_token,
		to: customer.phone,
		body: msgBody,
	});

	const { data: msg, error } = await supabase
		.from('messages')
		.insert({ customer_id: customerId, direction: 'outbound', body: msgBody, status: 'sent' })
		.select()
		.single();

	if (error) return c.json({ error: error.message }, 500);
	return c.json(msg, 201);
});

export default customers;
