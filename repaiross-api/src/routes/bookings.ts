import { Hono } from 'hono';
import { AppContext, requireAuth, requireOwner } from '../middleware/auth';
import { db } from '../type/lib/db';
import { waSendText } from '../type/lib/whatsapp';

const bookings = new Hono<AppContext>();

// GET /bookings?status=&date=&location_id=&page=&limit=
bookings.get('/', requireAuth, async (c) => {
	const supabase = db(c.env);
	const status = c.req.query('status');
	const date = c.req.query('date'); // YYYY-MM-DD
	const locationId = c.req.query('location_id');
	const page = Number(c.req.query('page') ?? 1);
	const limit = Number(c.req.query('limit') ?? 20);
	const from = (page - 1) * limit;

	let query = supabase
		.from('bookings')
		.select(
			`id, slot_at, status, source, service_notes, created_at,
       customers(id, name, phone),
       vehicles(id, make, model, registration)`,
			{ count: 'exact' },
		)
		.range(from, from + limit - 1)
		.order('slot_at', { ascending: true });

	if (status) query = query.eq('status', status);
	if (locationId) query = query.eq('location_id', locationId);
	if (date) {
		const start = `${date}T00:00:00`;
		const end = `${date}T23:59:59`;
		query = query.gte('slot_at', start).lte('slot_at', end);
	}

	const { data, error, count } = await query;
	if (error) return c.json({ error: error.message }, 500);
	return c.json({ data, total: count, page, limit });
});

// POST /bookings
bookings.post('/', requireOwner, async (c) => {
	const supabase = db(c.env);
	const body = await c.req.json();
	const staff = c.get('staff');

	const { data, error } = await supabase
		.from('bookings')
		.insert({
			location_id: body.location_id ?? staff.location_id,
			customer_id: body.customer_id,
			vehicle_id: body.vehicle_id ?? null,
			source: body.source,
			slot_at: body.slot_at ?? null,
			service_notes: body.service_notes ?? null,
			status: 'pending',
		})
		.select(`*, customers(name, phone), vehicles(make, model, registration)`)
		.single();

	if (error) return c.json({ error: error.message }, 500);
	return c.json(data, 201);
});

// PATCH /bookings/:id
bookings.patch('/:id', requireOwner, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');
	const body = await c.req.json();

	const allowed = ['status', 'slot_at', 'service_notes', 'vehicle_id'];
	const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
	for (const key of allowed) {
		if (key in body) updates[key] = body[key];
	}

	const { data, error } = await supabase.from('bookings').update(updates).eq('id', id).select().single();

	if (error) return c.json({ error: error.message }, 500);
	return c.json(data);
});

// POST /bookings/:id/confirm — confirm + send WhatsApp confirmation
bookings.post('/:id/confirm', requireOwner, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');

	// Fetch booking with related customer + location WA creds
	const { data: booking, error: bErr } = await supabase
		.from('bookings')
		.select(
			`
      *, 
      customers(name, phone, whatsapp_opt_in),
      locations(wa_number_id, wa_access_token),
      vehicles(make, model)
    `,
		)
		.eq('id', id)
		.single();

	if (bErr || !booking) return c.json({ error: 'Booking not found' }, 404);

	// Mark confirmed
	await supabase.from('bookings').update({ status: 'confirmed', updated_at: new Date().toISOString() }).eq('id', id);

	// Send WhatsApp if opted in
	const customer = booking.customers as any;
	const location = booking.locations as any;

	if (customer?.whatsapp_opt_in && location?.wa_number_id) {
		const slotDate = booking.slot_at
			? new Date(booking.slot_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
			: 'your scheduled time';

		await waSendText({
			waNumberId: location.wa_number_id,
			accessToken: location.wa_access_token,
			to: customer.phone,
			body: `Hi ${customer.name}, your booking for ${slotDate} is confirmed. See you then! 🔧`,
		});

		await supabase.from('bookings').update({ confirmation_sent: true }).eq('id', id);
	}

	return c.json({ success: true });
});

export default bookings;
