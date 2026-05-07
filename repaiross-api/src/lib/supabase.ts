import { createClient } from '@supabase/supabase-js';
import type { Env } from '../index';

export function getSupabase(env: Env) {
	return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}
