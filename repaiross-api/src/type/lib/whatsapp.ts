interface WaSendTextParams {
	waNumberId: string;
	accessToken: string;
	to: string;
	body: string;
}

export async function waSendText({ waNumberId, accessToken, to, body }: WaSendTextParams): Promise<void> {
	const url = `https://graph.facebook.com/v19.0/${waNumberId}/messages`;

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			messaging_product: 'whatsapp',
			to,
			type: 'text',
			text: { body },
		}),
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(`WhatsApp send failed: ${JSON.stringify(err)}`);
	}
}
