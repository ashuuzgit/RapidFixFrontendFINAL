import { Hono } from 'hono';
import { AppContext, requireOwner } from '../middleware/auth';
import { db } from '../type/lib/db';
import { waSendText } from '../type/lib/whatsapp';

const notify = new Hono<AppContext>();

// POST /notify/blast
// Body: { message: string, customer_ids?: string[] }
// - If customer_ids provided → send only to those (must be whatsapp_opt_in)
// - If omitted → send to ALL opted-in customers
notify.post('/blast', requireOwner, async (c) => {
	const supabase = db(c.env);
	const body = await c.req.json();

	const message: string = body.message?.trim();
	if (!message) return c.json({ error: 'message is required' }, 400);

	// Resolve WA credentials from active location
	const { data: location, error: locErr } = await supabase
		.from('locations')
		.select('id, wa_number_id, wa_access_token')
		.eq('active', true)
		.limit(1)
		.single();

	if (locErr || !location?.wa_number_id) {
		return c.json({ error: 'WhatsApp not configured for any active location' }, 500);
	}

	// Fetch target customers
	let query = supabase.from('customers').select('id, phone').eq('whatsapp_opt_in', true);

	if (Array.isArray(body.customer_ids) && body.customer_ids.length > 0) {
		query = query.in('id', body.customer_ids);
	}

	const { data: customers, error: custErr } = await query;
	if (custErr) return c.json({ error: custErr.message }, 500);
	if (!customers || customers.length === 0) {
		return c.json({ error: 'No eligible customers found' }, 404);
	}

	// Send + log — fire sequentially to avoid rate-limit spikes
	const results: { customer_id: string; phone: string; status: 'sent' | 'failed'; error?: string }[] = [];

	for (const customer of customers) {
		try {
			await waSendText({
				waNumberId: location.wa_number_id,
				accessToken: location.wa_access_token,
				to: customer.phone,
				body: message,
			});

			await supabase.from('messages').insert({
				customer_id: customer.id,
				direction: 'outbound',
				body: message,
				status: 'sent',
			});

			results.push({ customer_id: customer.id, phone: customer.phone, status: 'sent' });
		} catch (err: any) {
			await supabase.from('messages').insert({
				customer_id: customer.id,
				direction: 'outbound',
				body: message,
				status: 'failed',
			});

			results.push({
				customer_id: customer.id,
				phone: customer.phone,
				status: 'failed',
				error: err?.message ?? 'Unknown error',
			});
		}
	}

	const sent = results.filter((r) => r.status === 'sent').length;
	const failed = results.filter((r) => r.status === 'failed').length;

	return c.json({ sent, failed, results });
});

export default notify;
