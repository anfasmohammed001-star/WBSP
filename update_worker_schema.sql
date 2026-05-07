-- Enable Work Types / Skills storage
-- Add work_types to users table (general profile)
alter table public.users 
  add column if not exists work_types text[];

-- Ensure worker_profiles exists and has skills column
create table if not exists public.worker_profiles (
  id uuid references auth.users not null primary key,
  user_id uuid references auth.users not null,
  skills text[],
  bio text,
  hourly_rate numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- If table exists but missing skills
alter table public.worker_profiles
  add column if not exists skills text[];

-- Enable RLS
alter table public.worker_profiles enable row level security;

-- Policies for worker_profiles
create policy "Workers can view own profile"
  on public.worker_profiles for select
  using ( auth.uid() = user_id );

create policy "Workers can update own profile"
  on public.worker_profiles for update
  using ( auth.uid() = user_id );

create policy "Workers can insert own profile"
  on public.worker_profiles for insert
  with check ( auth.uid() = user_id );

create policy "Public can view workers"
  on public.worker_profiles for select
  using ( true );
