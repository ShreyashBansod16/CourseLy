import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client with anon key
// This respects RLS policies and is safe for client-side use
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);