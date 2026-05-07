import { Hono } from 'hono';
import { AppContext, requireOwner } from '../middleware/auth';
import { db } from '../type/lib/db';

const dashboard = new Hono<AppContext>();

// GET /dashboard — snapshot counts + revenue + recent activity
dashboard.get('/', requireOwner, async (c) => {
	const supabase = db(c.env);
	const now = new Date();
	const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
	const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

	const [jobsByStatus, newLeads, revenue, recentActivity] = await Promise.all([
		// Jobs grouped by status
		supabase.from('jobs').select('status').not('status', 'eq', 'delivered'),

		// New leads today
		supabase.from('leads').select('id', { count: 'exact' }).gte('created_at', todayStart),

		// Revenue — today / week / month from paid + partial bills
		supabase.from('bills').select('amount_paid, created_at').in('status', ['paid', 'partial']),

		// Last 10 status changes
		supabase
			.from('job_status_history')
			.select('*, staff:changed_by(name), jobs(id, customers(name), vehicles(make, model, registration))')
			.order('created_at', { ascending: false })
			.limit(10),
	]);

	// Count jobs by status
	const statusCounts: Record<string, number> = {};
	for (const job of jobsByStatus.data ?? []) {
		statusCounts[job.status] = (statusCounts[job.status] ?? 0) + 1;
	}

	// Revenue calculation
	const allBills = revenue.data ?? [];
	const revenueToday = allBills
		.filter((b: { created_at: string; amount_paid: unknown }) => b.created_at >= todayStart)
		.reduce((sum: number, b: { amount_paid: unknown }) => sum + Number(b.amount_paid), 0);
	const revenueWeek = allBills
		.filter((b: { created_at: string; amount_paid: unknown }) => b.created_at >= weekStart)
		.reduce((sum: number, b: { amount_paid: unknown }) => sum + Number(b.amount_paid), 0);
	const revenueMonth = allBills
		.filter((b: { created_at: string; amount_paid: unknown }) => b.created_at >= monthStart)
		.reduce((sum: number, b: { amount_paid: unknown }) => sum + Number(b.amount_paid), 0);

	return c.json({
		jobs: {
			received: statusCounts['received'] ?? 0,
			diagnosed: statusCounts['diagnosed'] ?? 0,
			in_progress: statusCounts['in_progress'] ?? 0,
			ready: statusCounts['ready'] ?? 0,
		},
		new_leads_today: newLeads.count ?? 0,
		revenue: {
			today: revenueToday,
			week: revenueWeek,
			month: revenueMonth,
		},
		recent_activity: recentActivity.data ?? [],
	});
});

export default dashboard;
