create extension if not exists pgcrypto;

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  location text not null,
  price_text text not null,
  contact_email text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.accommodation_listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  location text not null,
  price_text text not null,
  contact_email text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.marketplace_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  location text not null,
  price_text text not null,
  contact_email text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  stripe_customer_id text not null unique,
  stripe_subscription_id text not null unique,
  stripe_price_id text not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.jobs enable row level security;
alter table public.accommodation_listings enable row level security;
alter table public.marketplace_items enable row level security;
alter table public.subscriptions enable row level security;

create policy "Public can read jobs"
on public.jobs for select
to anon, authenticated
using (true);

create policy "Public can read accommodation listings"
on public.accommodation_listings for select
to anon, authenticated
using (true);

create policy "Public can read marketplace items"
on public.marketplace_items for select
to anon, authenticated
using (true);
