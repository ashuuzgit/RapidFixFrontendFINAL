import { Hono } from 'hono';
import { AppContext, requireAuth, requireOwner } from '../middleware/auth';
import { db } from '../type/lib/db';

const staff = new Hono<AppContext>();

// GET /staff?role=&active=
staff.get('/', requireAuth, async (c) => {
	const supabase = db(c.env);
	const me = c.get('staff');
	const role = c.req.query('role');
	const activeParam = c.req.query('active');

	let query = supabase
		.from('staff')
		.select('id, name, role, phone, email, active, created_at')
		.eq('location_id', me.location_id) // scoped to same location
		.order('name', { ascending: true });

	if (role) query = query.eq('role', role);
	if (activeParam !== undefined) {
		query = query.eq('active', activeParam !== 'false');
	} else {
		query = query.eq('active', true); // default: only active staff
	}

	const { data, error } = await query;
	if (error) return c.json({ error: error.message }, 500);
	return c.json({ data });
});

// GET /staff/:id
staff.get('/:id', requireOwner, async (c) => {
	const supabase = db(c.env);
	const me = c.get('staff');
	const id = c.req.param('id');

	const { data, error } = await supabase
		.from('staff')
		.select('id, name, role, phone, email, active, created_at')
		.eq('id', id)
		.eq('location_id', me.location_id)
		.single();

	if (error || !data) return c.json({ error: 'Staff not found' }, 404);
	return c.json(data);
});

// POST /staff — owner only
staff.post('/', requireOwner, async (c) => {
	const supabase = db(c.env);
	const me = c.get('staff');
	const body = await c.req.json();

	if (!body.name || !body.phone || !body.role) {
		return c.json({ error: 'name, phone and role are required' }, 422);
	}

	const validRoles = ['owner', 'admin', 'mechanic'];
	if (!validRoles.includes(body.role)) {
		return c.json({ error: `role must be one of: ${validRoles.join(', ')}` }, 422);
	}

	const { data, error } = await supabase
		.from('staff')
		.insert({
			location_id: me.location_id,
			name: body.name,
			phone: body.phone,
			email: body.email ?? null,
			role: body.role,
			active: true,
		})
		.select()
		.single();

	if (error) return c.json({ error: error.message }, 500);
	return c.json(data, 201);
});

// PATCH /staff/:id — owner only
staff.patch('/:id', requireOwner, async (c) => {
	const supabase = db(c.env);
	const me = c.get('staff');
	const id = c.req.param('id');
	const body = await c.req.json();

	const allowed = ['name', 'phone', 'email', 'role', 'active'];
	const updates: Record<string, unknown> = {};
	for (const key of allowed) {
		if (key in body) updates[key] = body[key];
	}

	if (Object.keys(updates).length === 0) {
		return c.json({ error: 'No valid fields to update' }, 422);
	}

	const { data, error } = await supabase
		.from('staff')
		.update(updates)
		.eq('id', id)
		.eq('location_id', me.location_id) // can't update staff from other locations
		.select()
		.single();

	if (error || !data) return c.json({ error: error?.message ?? 'Not found' }, 500);
	return c.json(data);
});

export default staff;
