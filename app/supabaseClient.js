import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rbwyllcbtgtflzovqdpr.supabase.co';
const supabaseServiceKey  = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
