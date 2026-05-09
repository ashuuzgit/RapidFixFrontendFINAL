import { Hono } from 'hono';
import { AppContext, requireOwner } from '../middleware/auth';
import { db } from '../type/lib/db';
import { waSendText } from '../type/lib/whatsapp'

const leads = new Hono<AppContext>();

// GET /leads?status=&assigned_to=&page=&limit=
leads.get('/', requireOwner, async (c) => {
  const supabase   = db(c.env);
  const status     = c.req.query('status');
  const assignedTo = c.req.query('assigned_to');
  const page       = Number(c.req.query('page')  ?? 1);
  const limit      = Number(c.req.query('limit') ?? 20);
  const from       = (page - 1) * limit;

  let query = supabase
    .from('leads')
    .select(
      `id, wa_id, customer_name, phone, status, created_at, updated_at,
       staff:assigned_to(id, name),
       customers(id, name)`,
      { count: 'exact' }
    )
    .range(from, from + limit - 1)
    .order('updated_at', { ascending: false });

  if (status)     query = query.eq('status', status);
  if (assignedTo) query = query.eq('assigned_to', assignedTo);

  const { data, error, count } = await query;
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ data, total: count, page, limit });
});

// PATCH /leads/:id — update status / assign
leads.patch('/:id', requireOwner, async (c) => {
  const supabase = db(c.env);
  const id       = c.req.param('id');
  const body     = await c.req.json();

  const allowed = ['status', 'assigned_to'];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// POST /leads/:id/convert — convert lead → customer
leads.post('/:id/convert', requireOwner, async (c) => {
  const supabase = db(c.env);
  const id       = c.req.param('id');
  const body     = await c.req.json();

  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (!lead) return c.json({ error: 'Lead not found' }, 404);
  if (lead.customer_id) return c.json({ error: 'Lead already converted' }, 409);

  // Create customer
  const { data: customer, error: custErr } = await supabase
    .from('customers')
    .insert({
      name:            body.name ?? lead.customer_name ?? 'Unknown',
      phone:           lead.phone,
      email:           body.email ?? null,
      whatsapp_opt_in: true,
    })
    .select()
    .single();

  if (custErr) {
    if (custErr.code === '23505') return c.json({ error: 'Phone number already registered as a customer' }, 409);
    return c.json({ error: custErr.message }, 500);
  }

  // Link lead to customer + mark converted
  await supabase
    .from('leads')
    .update({ customer_id: customer.id, status: 'converted', updated_at: new Date().toISOString() })
    .eq('id', id);

  // Link any existing messages to this customer
  await supabase
    .from('messages')
    .update({ customer_id: customer.id })
    .eq('lead_id', id);

  return c.json({ success: true, customer });
});

// GET /leads/:id/messages — conversation thread
leads.get('/:id/messages', requireOwner, async (c) => {
  const supabase = db(c.env);
  const leadId   = c.req.param('id');

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true });

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// POST /leads/:id/messages — send outbound WhatsApp reply
leads.post('/:id/messages', requireOwner, async (c) => {
  const supabase = db(c.env);
  const leadId   = c.req.param('id');
  const { body: msgBody } = await c.req.json();

  const { data: lead } = await supabase
    .from('leads')
    .select('phone, location_id')
    .eq('id', leadId)
    .single();

  if (!lead) return c.json({ error: 'Lead not found' }, 404);

  const { data: location } = await supabase
    .from('locations')
    .select('wa_number_id, wa_access_token')
    .eq('id', lead.location_id)
    .single();

  if (!location?.wa_number_id) return c.json({ error: 'WhatsApp not configured' }, 500);

  await waSendText({
    waNumberId:  location.wa_number_id,
    accessToken: location.wa_access_token,
    to:          lead.phone,
    body:        msgBody,
  });

  const { data: msg, error } = await supabase
    .from('messages')
    .insert({ lead_id: leadId, direction: 'outbound', body: msgBody, status: 'sent' })
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json(msg, 201);
});

export default leads;