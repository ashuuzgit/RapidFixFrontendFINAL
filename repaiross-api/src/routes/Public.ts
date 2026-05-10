import { Hono } from 'hono';
import { AppContext } from '../middleware/auth';
import { db } from '../type/lib/db';

const pub = new Hono<AppContext>();

const isPhone = (contact: string) => /^[6-9]\d{9}$/.test(contact);

// GET /public/lookup?contact=9876543210
pub.get('/lookup', async (c) => {
	const contact = c.req.query('contact')?.trim();
	if (!contact) return c.json({ error: 'contact is required' }, 400);

	const supabase = db(c.env);
	const phone = isPhone(contact);

	const { data, error } = await supabase
		.from('customers')
		.select('id, name')
		.eq(phone ? 'phone' : 'email', contact)
		.maybeSingle();

	if (error) return c.json({ error: error.message }, 500);
	if (!data) return c.json({ found: false });

	return c.json({
		found: true,
		customerId: data.id,
		name: data.name.split(' ')[0], // first name only
	});
});

// POST /public/booking
pub.post('/booking', async (c) => {
	const body = await c.req.json();
	const supabase = db(c.env);

	// ── Validate required fields ──────────────────────────────────────────────
	if (!body.contact || !body.brand || !body.model || !body.serviceType || !body.date) {
		return c.json({ error: 'Missing required fields' }, 400);
	}
	if (!body.customerId && !body.name?.trim()) {
		return c.json({ error: 'Name is required for new customers' }, 400);
	}

	// ── Step 1: Customer ──────────────────────────────────────────────────────
	let customerId: string = body.customerId;

	if (!customerId) {
		const phone = isPhone(body.contact);
		const { data, error } = await supabase
			.from('customers')
			.insert({
				name: body.name.trim(),
				phone: phone ? body.contact : null,
				email: phone ? null : body.contact,
				whatsapp_opt_in: true,
			})
			.select('id')
			.single();

		if (error) {
			if (error.code === '23505') return c.json({ error: 'Contact already registered' }, 409);
			return c.json({ error: error.message }, 500);
		}
		customerId = data.id;
	}

	// ── Step 2: Vehicle (upsert) ──────────────────────────────────────────────
	const { data: existingVehicle } = await supabase
		.from('vehicles')
		.select('id')
		.eq('customer_id', customerId)
		.eq('make', body.brand)
		.eq('model', body.model)
		.maybeSingle();

	let vehicleId: string = existingVehicle?.id;

	if (!vehicleId) {
		const { data, error } = await supabase
			.from('vehicles')
			.insert({
				customer_id: customerId,
				type: body.vehicleType?.toLowerCase(),
				make: body.brand,
				model: body.model,
				engine_type: body.engineType ?? null,
				cc: body.bikeCC ?? null,
			})
			.select('id')
			.single();

		if (error) return c.json({ error: error.message }, 500);
		vehicleId = data.id;
	}

	// ── Step 3: Booking ───────────────────────────────────────────────────────
	const { data: booking, error: bookingError } = await supabase
		.from('bookings')
		.insert({
			customer_id: customerId,
			vehicle_id: vehicleId,
			source: 'online',
			slot_at: body.date ?? null,
			service_notes: body.problem ?? null,
			status: 'pending',
		})
		.select('id')
		.single();

	if (bookingError) return c.json({ error: bookingError.message }, 500);

	return c.json({ success: true, bookingId: booking.id }, 201);
});

export default pub;
