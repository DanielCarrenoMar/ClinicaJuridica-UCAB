import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
// In backend, we should use SERVICE_ROLE_KEY to bypass RLS if available.
// Fallback to ANON_KEY if not, but it might fail if RLS is on.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase credentials are missing in .env file (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY). Supabase features will be disabled.');
} else {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
    } catch (error) {
        console.error('❌ Error creating Supabase client:', error);
        supabase = null;
    }
}

export { supabase };
