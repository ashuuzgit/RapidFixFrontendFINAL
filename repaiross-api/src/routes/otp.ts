import { Hono } from 'hono';
import { AppContext } from '../middleware/auth';
import { db } from '../type/lib/db';

const otp = new Hono<AppContext>();

// POST /public/otp/send
otp.post('/send', async (c) => {
	const supabase = db(c.env);
	const { phone } = await c.req.json();

	if (!phone) return c.json({ error: 'Phone is required' }, 422);

	// Generate 6-digit code
	const code = Math.floor(100000 + Math.random() * 900000).toString();
	const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

	// Invalidate any previous unused OTPs for this phone
	await supabase.from('otps').update({ used: true }).eq('phone', phone).eq('used', false);

	// Store new OTP
	// Store new OTP
	const { error } = await supabase.from('otps').insert({ phone, code, expires_at });

	if (error) {
		console.error('DB error:', error);
		return c.json({ error: 'Failed to create OTP' }, 500);
	}

	// Send via Fast2SMS
	const smsRes = await fetch(
		`https://www.fast2sms.com/dev/bulkV2?authorization=${c.env.FAST2SMS_API_KEY}&message=Your verification OTP is ${code}. Valid for 10 minutes.&language=english&route=q&numbers=${phone}`,
	);

	const smsBody = await smsRes.json();
	console.log('Fast2SMS response:', smsRes.status, smsBody);

	if (!smsRes.ok) return c.json({ error: 'Failed to send OTP' }, 500);

	return c.json({ success: true });
});

// POST /public/otp/verify
otp.post('/verify', async (c) => {
	const supabase = db(c.env);
	const { phone, code } = await c.req.json();

	if (!phone || !code) return c.json({ error: 'Phone and code are required' }, 422);

	const { data, error } = await supabase
		.from('otps')
		.select()
		.eq('phone', phone)
		.eq('code', code)
		.eq('used', false)
		.gte('expires_at', new Date().toISOString())
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

	if (error || !data) return c.json({ error: 'Invalid or expired OTP' }, 400);

	// Mark as used
	await supabase.from('otps').update({ used: true }).eq('id', data.id);

	return c.json({ success: true });
});

export default otp;
