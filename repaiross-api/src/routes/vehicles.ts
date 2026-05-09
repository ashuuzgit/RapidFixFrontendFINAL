import { Hono } from 'hono';
import { AppContext, requireAuth, requireOwner } from '../middleware/auth';
import { db } from '../type/lib/db';

const vehicles = new Hono<AppContext>();

// GET /vehicles?customer_id=
vehicles.get('/', requireAuth, async (c) => {
	const supabase = db(c.env);
	const customerId = c.req.query('customer_id');

	if (!customerId) return c.json({ error: 'customer_id is required' }, 400);

	const { data, error } = await supabase
		.from('vehicles')
		.select('*')
		.eq('customer_id', customerId)
		.order('created_at', { ascending: false });

	if (error) return c.json({ error: error.message }, 500);
	return c.json(data);
});

// GET /vehicles/:id — vehicle + job history
vehicles.get('/:id', requireAuth, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');

	const [vehicleRes, jobsRes] = await Promise.all([
		supabase.from('vehicles').select('*').eq('id', id).single(),
		supabase
			.from('jobs')
			.select('id, status, created_at, total_amount')
			.eq('vehicle_id', id)
			.order('created_at', { ascending: false })
			.limit(10),
	]);

	if (vehicleRes.error) return c.json({ error: 'Vehicle not found' }, 404);
	return c.json({
		...vehicleRes.data,
		recent_jobs: jobsRes.data ?? [],
	});
});

// POST /vehicles
vehicles.post('/', requireOwner, async (c) => {
	const supabase = db(c.env);
	const body = await c.req.json();

	if (!body.customer_id) return c.json({ error: 'customer_id is required' }, 400);
	if (!body.type || !['car', 'bike'].includes(body.type)) {
		return c.json({ error: 'type must be car or bike' }, 400);
	}

	const { data, error } = await supabase
		.from('vehicles')
		.insert({
			customer_id: body.customer_id,
			type: body.type,
			make: body.make ?? null,
			model: body.model ?? null,
			year: body.year ?? null,
			registration: body.registration ?? null,
			color: body.color ?? null,
		})
		.select()
		.single();

	if (error) {
		if (error.code === '23505') return c.json({ error: 'Registration already exists' }, 409);
		return c.json({ error: error.message }, 500);
	}
	return c.json(data, 201);
});

// PATCH /vehicles/:id
vehicles.patch('/:id', requireOwner, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');
	const body = await c.req.json();

	const allowed = ['type', 'make', 'model', 'year', 'registration', 'color'];
	const updates: Record<string, unknown> = {};
	for (const key of allowed) {
		if (key in body) updates[key] = body[key];
	}

	if (updates.type && !['car', 'bike'].includes(updates.type as string)) {
		return c.json({ error: 'type must be car or bike' }, 400);
	}

	if (!Object.keys(updates).length) return c.json({ error: 'No valid fields to update' }, 400);

	const { data, error } = await supabase.from('vehicles').update(updates).eq('id', id).select().single();

	if (error) return c.json({ error: error.message }, 500);
	return c.json(data);
});

// DELETE /vehicles/:id — block if active jobs exist
vehicles.delete('/:id', requireOwner, async (c) => {
	const supabase = db(c.env);
	const id = c.req.param('id');

	const { count } = await supabase
		.from('jobs')
		.select('id', { count: 'exact', head: true })
		.eq('vehicle_id', id)
		.in('status', ['pending', 'in_progress', 'waiting_parts']);

	if (count && count > 0) {
		return c.json({ error: 'Cannot delete vehicle with active jobs' }, 409);
	}

	const { error } = await supabase.from('vehicles').delete().eq('id', id);
	if (error) return c.json({ error: error.message }, 500);
	return c.json({ success: true });
});

export default vehicles;
