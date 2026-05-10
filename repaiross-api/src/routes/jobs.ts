import { Hono } from 'hono';
import { AppContext, requireAuth, requireOwner } from '../middleware/auth';
import { db } from '../type/lib/db';
import { waSendText } from '../type/lib/whatsapp';

function jobStatusMessage(customerName: string, vehicleLabel: string, status: string, billUrl?: string): string {
	const v = vehicleLabel || 'your vehicle';
	const msgs: Record<string, string> = {
		diagnosed: `Hi ${customerName}, we've diagnosed ${v}. Work begins shortly.`,
		in_progress: `Hi ${customerName}, repairs are underway on ${v}.`,
		ready: `Hi ${customerName}, ${v} is ready for pickup! 🎉`,
		delivered: `Hi ${customerName}, thanks for visiting. Your bill: ${billUrl ?? ''}`,
	};
	return msgs[status] ?? `Hi ${customerName}, your job status has been updated to: ${status}.`;
}

const jobs = new Hono<AppContext>();

// GET /jobs?status=&mechanic_id=&location_id=&page=&limit=
jobs.get('/', requireAuth, async (c) => {
	const supabase = db(c.env);
	const staff = c.get('staff');
	const status = c.req.query('status');
	const mechanicId = c.req.query('mechanic_id');
	const page = Number(c.req.query('page') ?? 1);
	const limit = Number(c.req.query('limit') ?? 20);
	const from = (page - 1) * limit;

	let query = supabase
		.from('jobs')
		.select(
			`id, status, service_description, estimated_completion, odometer_in, created_at, updated_at,
       customers(id, name, phone),
       vehicles(id, make, model, registration, type),
       staff:mechanic_id(id, name)`,
			{ count: 'exact' },
		)
		.range(from, from + limit - 1)
		.order('created_at', { ascending: false });

	// Mechanics only see their own jobs
	if (staff.role === 'mechanic') {
		query = query.eq('mechanic_id', staff.sub);
	} else {
		if (mechanicId) query = query.eq('mechanic_id', mechanicId);
	}

	if (status) query = query.eq('status', status);

	const { data, error, count } = await query;
	if (error) return c.json({ error: error.message }, 500);
	return c.json({ data, total: count, page, limit });
});

// POST /jobs
jobs.post('/', requireOwner, async (c) => {
	const supabase = db(c.env);
	const body = await c.req.json();
	const staff = c.get('staff');

	const { data, error } = await supabase
		.from('jobs')
		.insert({
			location_id: body.location_id ?? staff.location_id,
			booking_id: body.booking_id ?? null,
			customer_id: body.customer_id,
			vehicle_id: body.vehicle_id ?? null,
			mechanic_id: body.mechanic_id ?? null,
			status: 'received',
			service_description: body.service_description ?? null,
			estimated_completion: body.estimated_completion ?? null,
			odometer_in: body.odometer_in ?? null,
		})
		.select()
		.single();

	if (error) return c.json({ error: error.message }, 500);

	// Log initial status in history
	await supabase.from('job_status_history').insert({
		job_id: data.id,
		status: 'received',
		changed_by: staff.sub,
		note: 'Job created',
		wa_sent: false,
	});
	if (body.booking_id) {
		await supabase.from('bookings').update({ status: 'converted', updated_at: new Date().toISOString() }).eq('id', body.booking_id);
	}

	return c.json(data, 201);
});

// GET /jobs/:id — full detail: job + history + notes + bill
jobs.get('/:id', requireAuth, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');
	const staff = c.get('staff');

	const { data: job, error } = await supabase
		.from('jobs')
		.select(
			`
      *,
      customers(id, name, phone, email, whatsapp_opt_in),
      vehicles(id, make, model, registration, type, color, year),
      mechanic:mechanic_id(id, name),
      bookings(id, slot_at, source)
    `,
		)
		.eq('id', id)
		.single();

	if (error || !job) return c.json({ error: 'Job not found' }, 404);

	// Mechanics can only see their own jobs
	if (staff.role === 'mechanic' && job.mechanic_id !== staff.sub) {
		return c.json({ error: 'Forbidden' }, 403);
	}

	const [historyRes, notesRes, billRes] = await Promise.all([
		supabase.from('job_status_history').select('*, staff:changed_by(name)').eq('job_id', id).order('created_at', { ascending: true }),
		supabase.from('job_notes').select('*, staff:staff_id(name)').eq('job_id', id).order('created_at', { ascending: true }),
		// Mechanics cannot see bill
		staff.role === 'owner'
			? supabase.from('bills').select('id, status, total, amount_due').eq('job_id', id).maybeSingle()
			: Promise.resolve({ data: null, error: null }),
	]);

	return c.json({
		...job,
		status_history: historyRes.data ?? [],
		notes: notesRes.data ?? [],
		bill: billRes.data ?? null,
	});
});

// PATCH /jobs/:id/status — advance status + log history + send WhatsApp
jobs.patch('/:id/status', requireAuth, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');
	const staff = c.get('staff');
	const { status, note } = await c.req.json();

	const validStatuses = ['received', 'diagnosed', 'in_progress', 'ready', 'delivered'];
	if (!validStatuses.includes(status)) {
		return c.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, 422);
	}

	// Fetch job with customer + vehicle + location WA creds
	const { data: job, error: jobErr } = await supabase
		.from('jobs')
		.select(
			`
      *,
      customers(id, name, phone, whatsapp_opt_in),
      vehicles(make, model, registration),
      locations(wa_number_id, wa_access_token),
      bills(id, public_token)
    `,
		)
		.eq('id', id)
		.single();

	if (jobErr || !job) return c.json({ error: 'Job not found' }, 404);

	// Mechanics can only update their own jobs
	if (staff.role === 'mechanic' && job.mechanic_id !== staff.sub) {
		return c.json({ error: 'Forbidden' }, 403);
	}

	// 1. Update job status
	const { error: updateErr } = await supabase.from('jobs').update({ status, updated_at: new Date().toISOString() }).eq('id', id);

	if (updateErr) return c.json({ error: updateErr.message }, 500);

	// 2. Log history (append-only)
	const { data: historyRow } = await supabase
		.from('job_status_history')
		.insert({ job_id: id, status, changed_by: staff.sub, note: note ?? null, wa_sent: false })
		.select()
		.single();

	// 3. Send WhatsApp if customer opted in and WA is configured
	const customer = job.customers as any;
	const vehicle = job.vehicles as any;
	const location = job.locations as any;
	const bills = job.bills as any[];

	let waSent = false;
	if (customer?.whatsapp_opt_in && location?.wa_number_id) {
		const vehicleLabel = vehicle ? `${vehicle.make ?? ''} ${vehicle.model ?? ''} (${vehicle.registration ?? ''})`.trim() : 'your vehicle';

		// For 'delivered' status, include bill URL if one exists
		const billUrl = bills?.[0] ? `https://repaiross.com/bill/${bills[0].public_token}` : undefined;

		const messageBody = jobStatusMessage(customer.name, vehicleLabel, status, billUrl);

		try {
			await waSendText({
				waNumberId: location.wa_number_id,
				accessToken: location.wa_access_token,
				to: customer.phone,
				body: messageBody,
			});
			waSent = true;
		} catch (e) {
			// Don't fail the request if WA send fails — log and continue
			console.error('WhatsApp send failed:', e);
		}

		if (historyRow) {
			await supabase.from('job_status_history').update({ wa_sent: waSent }).eq('id', historyRow.id);
		}
	}

	return c.json({ success: true, status, wa_sent: waSent });
});

// PATCH /jobs/:id — update editable fields (mechanic, completion, odometer, description)
jobs.patch('/:id', requireOwner, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');
	const body = await c.req.json();

	const allowed = ['mechanic_id', 'estimated_completion', 'odometer_in', 'odometer_out', 'service_description', 'vehicle_id'];
	const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
	for (const key of allowed) {
		if (key in body) updates[key] = body[key];
	}

	const { data, error } = await supabase.from('jobs').update(updates).eq('id', id).select().single();

	if (error) return c.json({ error: error.message }, 500);
	return c.json(data);
});

// POST /jobs/:id/notes — add internal note
jobs.post('/:id/notes', requireAuth, async (c) => {
	const supabase = db(c.env);
	const jobId = c.req.param('id');
	const staff = c.get('staff');
	const { note } = await c.req.json();

	if (!note?.trim()) return c.json({ error: 'Note cannot be empty' }, 422);

	// Mechanics can only note on their own jobs
	if (staff.role === 'mechanic') {
		const { data: job } = await supabase.from('jobs').select('mechanic_id').eq('id', jobId).single();
		if (job?.mechanic_id !== staff.sub) return c.json({ error: 'Forbidden' }, 403);
	}

	const { data, error } = await supabase
		.from('job_notes')
		.insert({ job_id: jobId, staff_id: staff.sub, note })
		.select('*, staff:staff_id(name)')
		.single();

	if (error) return c.json({ error: error.message }, 500);
	return c.json(data, 201);
});

export default jobs;
