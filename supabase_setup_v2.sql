-- SAFE MIGRATION SCRIPT V2 (UPDATED)
-- This script matches the application code ("customer_id" in jobs, etc.)
-- and is safe to run multiple times.

-- 1. Ensure 'users' table exists
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  user_type text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.users enable row level security;

-- 2. Ensure 'worker_profiles' exists
create table if not exists public.worker_profiles (
  id uuid references public.users not null primary key,
  skills text[],
  bio text,
  hourly_rate numeric,
  location text,
  average_rating numeric default 0,
  created_at timestamptz default now()
);
alter table public.worker_profiles enable row level security;

-- 3. Ensure 'jobs' table exists 
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references public.users, 
  title text,
  description text,
  category text,
  job_type text,
  budget numeric,
  urgency_level text,
  location_address text,
  status text default 'open',
  created_at timestamptz default now()
);
alter table public.jobs enable row level security;

-- 4. Fix 'jobs' columns safely
do $$
begin
  -- Rename user_id to customer_id if user_id exists
  if exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'user_id') then
    alter table public.jobs rename column user_id to customer_id;
  end if;

  -- Add customer_id if missing
  if not exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'customer_id') then
    alter table public.jobs add column customer_id uuid references public.users;
  end if;

  -- Add missing columns
  if not exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'images') then
    alter table public.jobs add column images text[];
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'voice_note_url') then
    alter table public.jobs add column voice_note_url text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'scheduled_date') then
    alter table public.jobs add column scheduled_date timestamptz;
  end if;
  
   if not exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'updated_at') then
    alter table public.jobs add column updated_at timestamptz default now();
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'worker_id') then
    alter table public.jobs add column worker_id uuid references public.users;
  end if;
end $$;

-- 5. Helper Tables (Messages)
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.users not null,
  recipient_id uuid references public.users not null,
  content text,
  read boolean default false,
  created_at timestamptz default now()
);
alter table public.messages enable row level security;

-- FIX: Add to publication only if not present
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;


-- 6. Storage Bucket
insert into storage.buckets (id, name, public) 
values ('job-media', 'job-media', true)
on conflict (id) do nothing;

drop policy if exists "Job Media Public Access" on storage.objects;
create policy "Job Media Public Access"
on storage.objects for select
using ( bucket_id = 'job-media' );

drop policy if exists "Users can upload job media" on storage.objects;
create policy "Users can upload job media"
on storage.objects for insert
with check ( bucket_id = 'job-media' and auth.role() = 'authenticated' );

-- 7. Apply Policies
drop policy if exists "Users can create jobs" on public.jobs;
create policy "Users can create jobs" on public.jobs for insert with check (auth.uid() = customer_id);

drop policy if exists "Users can update their own jobs" on public.jobs;
create policy "Users can update their own jobs" on public.jobs for update using (auth.uid() = customer_id);

drop policy if exists "Users can view all public profiles" on public.users;
create policy "Users can view all public profiles" on public.users for select using (true);

drop policy if exists "Users can insert their own profile" on public.users;
create policy "Users can insert their own profile" on public.users for insert with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.users;
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id);

drop policy if exists "Anyone can view open jobs" on public.jobs;
create policy "Anyone can view open jobs" on public.jobs for select using (true); 
