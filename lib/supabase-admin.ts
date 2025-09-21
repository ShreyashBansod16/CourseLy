import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key
// This bypasses RLS policies and should only be used on the server
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
