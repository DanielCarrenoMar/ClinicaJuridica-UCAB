import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
// In backend, we should use SERVICE_ROLE_KEY to bypass RLS if available.
// Fallback to ANON_KEY if not, but it might fail if RLS is on.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials are missing in .env file (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY)');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
