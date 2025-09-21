-- Create contact_messages table (idempotent)
create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean not null default false,
  reply_text text,
  replied_at timestamptz,
  replied_by text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Ensure column exists for older installations
alter table public.contact_messages
  add column if not exists is_read boolean not null default false;
alter table public.contact_messages
  add column if not exists reply_text text;
alter table public.contact_messages
  add column if not exists replied_at timestamptz;
alter table public.contact_messages
  add column if not exists replied_by text;

-- Optional policies (commented out). Since your API uses the service role, it bypasses RLS.
-- If you want authenticated users to insert directly from the client, uncomment below.
-- create policy "allow_authenticated_insert" on public.contact_messages
--   for insert
--   to authenticated
--   with check (true);

-- Read access is typically admin-only via service role. Do NOT open select to anon by default.
