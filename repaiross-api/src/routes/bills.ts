import { Hono } from 'hono';
import { AppContext, requireOwner } from '../middleware/auth';
import { db } from '../type/lib/db';
import { waSendText } from '../type/lib/whatsapp';

const bills = new Hono<AppContext>();

// ─── PUBLIC ROUTE — no auth ───────────────────────────────────────────────────

// GET /b/:token — public bill page data
bills.get('/b/:token', async (c) => {
	const supabase = db(c.env);
	const token = c.req.param('token');

	const { data, error } = await supabase
		.from('bills')
		.select(
			`
      id, subtotal, discount, tax_type, tax_rate, tax_amount, total,
      amount_paid, amount_due, status, notes, created_at,
      customers(name, phone),
      vehicles(make, model, registration, type),
      jobs(id, service_description),
      locations(name, address, phone),
      bill_items(id, category, description, quantity, unit_price, total)
    `,
		)
		.eq('public_token', token)
		.single();

	if (error || !data) return c.json({ error: 'Bill not found' }, 404);
	return c.json(data);
});

// ─── PROTECTED ROUTES ─────────────────────────────────────────────────────────

// GET /bills?status=&page=&limit=
bills.get('/', requireOwner, async (c) => {
	const supabase = db(c.env);
	const status = c.req.query('status');
	const page = Number(c.req.query('page') ?? 1);
	const limit = Number(c.req.query('limit') ?? 20);
	const from = (page - 1) * limit;

	let query = supabase
		.from('bills')
		.select(
			`id, subtotal, total, amount_due, status, sent_at, created_at, public_token,
       customers(name, phone),
       jobs(id)`,
			{ count: 'exact' },
		)
		.range(from, from + limit - 1)
		.order('created_at', { ascending: false });

	if (status) query = query.eq('status', status);

	const { data, error, count } = await query;
	if (error) return c.json({ error: error.message }, 500);
	return c.json({ data, total: count, page, limit });
});

// POST /bills — create draft
bills.post('/', requireOwner, async (c) => {
	const supabase = db(c.env);
	const body = await c.req.json();

	const { data: job } = await supabase.from('jobs').select('customer_id, location_id').eq('id', body.job_id).single();

	if (!job) return c.json({ error: 'Job not found' }, 404);

	const { data: bill, error } = await supabase
		.from('bills')
		.insert({
			job_id: body.job_id,
			customer_id: job.customer_id,
			location_id: job.location_id,
			notes: body.notes ?? null,
			status: 'draft',
		})
		.select()
		.single();

	if (error) return c.json({ error: error.message }, 500);

	if (body.items?.length) {
		const items = body.items.map((item: any) => ({
			bill_id: bill.id,
			category: item.category,
			description: item.description,
			quantity: item.quantity ?? 1,
			unit_price: item.unit_price,
		}));
		const { error: itemsErr } = await supabase.from('bill_items').insert(items);
		if (itemsErr) return c.json({ error: itemsErr.message }, 500);
		await recalcTotals(supabase, bill.id, body.discount ?? 0);
	}

	const { data: full } = await supabase.from('bills').select('*, bill_items(*)').eq('id', bill.id).single();

	return c.json(full, 201);
});

// GET /bills/:id — bill + items
bills.get('/:id', requireOwner, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');

	const { data, error } = await supabase
		.from('bills')
		.select(
			`
      *,
      customers(name, phone),
      vehicles:jobs(vehicles(make, model, registration)),
      locations(name, address, phone),
      bill_items(*)
    `,
		)
		.eq('id', id)
		.single();

	if (error || !data) return c.json({ error: 'Bill not found' }, 404);
	return c.json(data);
});

// PATCH /bills/:id — update items, discount, notes
bills.patch('/:id', requireOwner, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');
	const body = await c.req.json();

	if (body.items) {
		await supabase.from('bill_items').delete().eq('bill_id', id);
		if (body.items.length) {
			const items = body.items.map((item: any) => ({
				bill_id: id,
				category: item.category,
				description: item.description,
				quantity: item.quantity ?? 1,
				unit_price: item.unit_price,
			}));
			await supabase.from('bill_items').insert(items);
		}
	}

	const discount = body.discount ?? undefined;
	if (body.items || discount !== undefined) {
		await recalcTotals(supabase, id, discount);
	}

	const updateFields: Record<string, unknown> = { updated_at: new Date().toISOString() };
	if (body.notes !== undefined) updateFields.notes = body.notes;

	const { data, error } = await supabase.from('bills').update(updateFields).eq('id', id).select('*, bill_items(*)').single();

	if (error) return c.json({ error: error.message }, 500);
	return c.json(data);
});

// POST /bills/:id/send — mark sent + deliver via WhatsApp / email / both
bills.post('/:id/send', requireOwner, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');
	const body = await c.req.json();
	const delivery_method = body.delivery_method as 'whatsapp' | 'email' | 'both';

	const { data: bill, error: billErr } = await supabase
		.from('bills')
		.select(
			`
      *, 
      customers(name, phone, email, whatsapp_opt_in),
      locations(wa_number_id, wa_access_token)
    `,
		)
		.eq('id', id)
		.single();

	if (billErr || !bill) return c.json({ error: 'Bill not found' }, 404);

	const customer = bill.customers as any;
	const location = bill.locations as any;
	const billUrl = `https://repaiross.com/bill/${bill.public_token}`;

	if ((delivery_method === 'whatsapp' || delivery_method === 'both') && customer?.whatsapp_opt_in && location?.wa_number_id) {
		await waSendText({
			waNumberId: location.wa_number_id,
			accessToken: location.wa_access_token,
			to: customer.phone,
			body: `Hi ${customer.name}, your bill is ready. Total: ₹${bill.total}. View here: ${billUrl}`,
		});
	}

	if (delivery_method === 'email' || delivery_method === 'both') {
		// TODO: send email via Resend
	}

	const { data: updated, error: updateErr } = await supabase
		.from('bills')
		.update({
			status: 'sent',
			delivery_method,
			sent_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		.eq('id', id)
		.select()
		.single();

	if (updateErr) return c.json({ error: updateErr.message }, 500);
	return c.json(updated);
});

// PATCH /bills/:id/payment — record payment
bills.patch('/:id/payment', requireOwner, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');
	const body = await c.req.json();
	const newPaid = Number(body.amount_paid);

	if (isNaN(newPaid)) return c.json({ error: 'amount_paid must be a number' }, 400);

	const { data: bill } = await supabase.from('bills').select('total').eq('id', id).single();

	if (!bill) return c.json({ error: 'Bill not found' }, 404);

	const newStatus = newPaid >= bill.total ? 'paid' : newPaid > 0 ? 'partial' : 'unpaid';

	const { data, error } = await supabase
		.from('bills')
		.update({
			amount_paid: newPaid,
			status: newStatus,
			paid_at: newStatus === 'paid' ? new Date().toISOString() : null,
			updated_at: new Date().toISOString(),
		})
		.eq('id', id)
		.select()
		.single();

	if (error) return c.json({ error: error.message }, 500);
	return c.json(data);
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function recalcTotals(supabase: any, billId: string, discount?: number) {
	const { data: items } = await supabase.from('bill_items').select('total').eq('bill_id', billId);

	const subtotal = (items ?? []).reduce((sum: number, i: any) => sum + Number(i.total), 0);
	const disc = discount ?? 0;
	const total = Math.max(0, subtotal - disc);

	await supabase.from('bills').update({ subtotal, discount: disc, total, updated_at: new Date().toISOString() }).eq('id', billId);
}

export default bills;
