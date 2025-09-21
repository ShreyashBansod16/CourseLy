-- Purchases table to unlock course access after successful Stripe payment
create extension if not exists pgcrypto;

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  course_id text not null,
  status text not null default 'paid', -- paid, refunded, etc.
  session_id text unique,
  created_at timestamptz not null default now()
);

create unique index if not exists purchases_unique_paid on public.purchases (user_email, course_id) where status = 'paid';

alter table public.purchases enable row level security;

-- Public read is not necessary; we’ll check from server using service role.
-- If you later want user self-reads, you can add a policy that allows selecting own rows by email.

NOTIFY pgrst, 'reload schema';
