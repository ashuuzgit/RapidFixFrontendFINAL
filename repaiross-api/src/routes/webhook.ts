import { Hono } from 'hono';
import { createHmac } from 'node:crypto';
import { Env } from '../index';
import { db } from '../type/lib/db';
import { waSendText } from '../type/lib/whatsapp';

type WebhookEnv = { Bindings: Env };
const webhook = new Hono<WebhookEnv>();

// GET /webhook/whatsapp — Meta subscription verification
webhook.get('/whatsapp', (c) => {
	const mode = c.req.query('hub.mode');
	const token = c.req.query('hub.verify_token');
	const challenge = c.req.query('hub.challenge');

	if (mode === 'subscribe' && token === c.env.WA_VERIFY_TOKEN) {
		return c.text(challenge ?? '', 200);
	}
	return c.text('Forbidden', 403);
});

// POST /webhook/whatsapp — inbound messages + status receipts
webhook.post('/whatsapp', async (c) => {
	// Verify request signature
	const rawBody = await c.req.text();
	const sigHeader = c.req.header('x-hub-signature-256') ?? '';
	const expected = 'sha256=' + createHmac('sha256', c.env.WA_APP_SECRET).update(rawBody).digest('hex');
	if (sigHeader !== expected) return c.text('Forbidden', 403);

	const supabase = db(c.env);
	let payload: any;
	try {
		payload = JSON.parse(rawBody);
	} catch {
		return c.text('Bad Request', 400);
	}

	const entry = payload?.entry?.[0];
	const changes = entry?.changes ?? [];

	for (const change of changes) {
		const value = change.value;
		if (!value) continue;

		// ── Inbound messages ───────────────────────────────────────────────────
		for (const msg of value.messages ?? []) {
			const waId = msg.from; // digits only, no +
			const phone = `+${waId}`;
			const body = msg.text?.body ?? msg.caption ?? null;
			const wamsgId = msg.id;

			// Deduplicate
			const { data: existing } = await supabase.from('messages').select('id').eq('wa_message_id', wamsgId).maybeSingle();
			if (existing) continue;

			// Find the active location tied to this WA number
			const waNumberId = value.metadata?.phone_number_id;
			const { data: location } = await supabase
				.from('locations')
				.select('id, wa_number_id, wa_access_token')
				.eq('wa_number_id', waNumberId)
				.single();

			// Check if known customer
			const { data: customer } = await supabase.from('customers').select('id, name, whatsapp_opt_in').eq('phone', phone).maybeSingle();

			let leadId: string | null = null;
			let customerId: string | null = customer?.id ?? null;

			if (!customer) {
				// Upsert lead
				const profileName = value.contacts?.[0]?.profile?.name ?? null;
				const { data: lead } = await supabase
					.from('leads')
					.upsert({ wa_id: waId, phone, customer_name: profileName, location_id: location?.id ?? null }, { onConflict: 'wa_id' })
					.select('id')
					.single();
				leadId = lead?.id ?? null;

				// Notify owner of new lead
				if (lead && location?.wa_number_id && c.env.OWNER_WA_NUMBER) {
					const preview = body ? body.slice(0, 80) : '(no text)';
					waSendText({
						waNumberId: location.wa_number_id,
						accessToken: location.wa_access_token,
						to: c.env.OWNER_WA_NUMBER,
						body: `New WhatsApp lead from ${phone}: "${preview}"`,
					}).catch(console.error);
				}
			}

			// Store message
			await supabase.from('messages').insert({
				lead_id: leadId,
				customer_id: customerId,
				direction: 'inbound',
				body,
				media_url: msg.image?.url ?? msg.document?.url ?? null,
				wa_message_id: wamsgId,
				status: 'delivered',
			});
		}

		// ── Delivery status updates ────────────────────────────────────────────
		for (const status of value.statuses ?? []) {
			await supabase.from('messages').update({ status: status.status }).eq('wa_message_id', status.id);
		}
	}

	return c.text('OK', 200);
});

export default webhook;
