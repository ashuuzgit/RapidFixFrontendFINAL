import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import authRoutes from './routes/auth';
import dashboard from './routes/dashboard';
import jobs from './routes/jobs';
import bookings from './routes/bookings';
import bills from './routes/bills';
import customers from './routes/customers';
import vehicles from './routes/vehicles';
import leads from './routes/leads';
import webhook from './routes/webhook';
import pub from './routes/Public';
import notify from './routes/notify';
// add import at the top with the others
import staff from './routes/staff';
import otp from './routes/otp';
// add route with the others

export interface Env {
	SUPABASE_URL: string;
	SUPABASE_SERVICE_KEY: string;
	JWT_SECRET: string;
	WA_VERIFY_TOKEN: string;
	WA_APP_SECRET: string;
	OWNER_WA_NUMBER: string;
	FAST2SMS_API_KEY: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', logger());
app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'] }));
app.route('/staff', staff);
app.route('/auth', authRoutes);
app.route('/dashboard', dashboard);
app.route('/jobs', jobs);
app.route('/bookings', bookings);
app.route('/bills', bills);
app.route('/customers', customers);
app.route('/vehicles', vehicles);
app.route('/leads', leads);
app.route('/webhook', webhook);
app.route('/public', pub);
app.route('/notify', notify);
app.route('/public/otp', otp);

app.get('/', (c) => c.json({ status: 'ok', service: 'repaiross-api' }));

export default app;
