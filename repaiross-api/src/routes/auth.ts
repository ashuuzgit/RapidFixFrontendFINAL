import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { getSupabase } from '../lib/supabase';
import { requireAuth } from '../middleware/auth';
import type { AppContext } from '../middleware/auth';

export const authRoutes = new Hono<AppContext>();

// ── POST /auth/login ──────────────────────────────────────────────────────────

authRoutes.post('/login', async (c) => {
	const body = await c.req.json<{ phone?: string; email?: string; password: string }>();

	if ((!body.phone && !body.email) || !body.password) {
		return c.json({ error: 'Credentials required' }, 400);
	}

	const db = getSupabase(c.env);

	// Sign in via Supabase Auth
	const { data: authData, error: authError } = body.email
		? await db.auth.signInWithPassword({ email: body.email, password: body.password })
		: await db.auth.signInWithPassword({ phone: body.phone!, password: body.password });

	if (authError || !authData.user) {
		return c.json({ error: 'Invalid credentials' }, 401);
	}

	// Fetch staff record linked to this auth user
	const { data: staff, error: staffError } = await db
		.from('staff')
		.select('id, name, role, location_id')
		.eq('auth_user_id', authData.user.id)
		.eq('active', true)
		.single();

	if (staffError || !staff) {
		return c.json({ error: 'Staff account not found or inactive' }, 403);
	}

	// Issue our own JWT
	const token = await sign(
		{
			sub: staff.id,
			name: staff.name,
			role: staff.role,
			location_id: staff.location_id,
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
		},
		c.env.JWT_SECRET,
	);

	return c.json({ token });
});

// ── GET /auth/me ──────────────────────────────────────────────────────────────

authRoutes.get('/me', requireAuth, async (c) => {
	const staff = c.get('staff');
	console.log('staff from token:', JSON.stringify(staff));
	const db = getSupabase(c.env);

	const { data, error } = await db.from('staff').select('id, name, role, location_id, email').eq('id', staff.sub).single();

	console.log('data:', JSON.stringify(data), 'error:', JSON.stringify(error));

	if (error || !data) return c.json({ error: 'Staff not found' }, 404);
	return c.json(data);
});
// bottom of src/routes/auth.ts — replace the existing export
export default authRoutes;
