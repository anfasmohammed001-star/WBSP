-- Enable Row Level Security (RLS) on all tables (Best Practice)
-- USERS TABLE (Extends auth.users)
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  user_type text, -- 'customer' or 'worker'
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.users enable row level security;

-- Policies for Users
create policy "Users can view all public profiles" 
on public.users for select 
using (true);

create policy "Users can insert their own profile" 
on public.users for insert 
with check (auth.uid() = id);

create policy "Users can update their own profile" 
on public.users for update 
using (auth.uid() = id);

-- WORKER PROFILES TABLE
create table public.worker_profiles (
  id uuid references public.users not null primary key,
  skills text[],
  bio text,
  hourly_rate numeric,
  location text,
  average_rating numeric default 0,
  created_at timestamptz default now()
);

alter table public.worker_profiles enable row level security;

-- Policies for Worker Profiles
create policy "Public can view worker profiles" 
on public.worker_profiles for select 
using (true);

create policy "Workers can update own profile" 
on public.worker_profiles for update 
using (auth.uid() = id);

create policy "Workers can insert own profile" 
on public.worker_profiles for insert 
with check (auth.uid() = id);

-- JOBS TABLE
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users not null,
  title text,
  description text,
  category text,
  job_type text,
  budget numeric,
  urgency_level text,
  location_address text,
  date text,
  time text,
  status text default 'open',
  created_at timestamptz default now()
);

alter table public.jobs enable row level security;

-- Policies for Jobs
create policy "Anyone can view open jobs" 
on public.jobs for select 
using (true); 

create policy "Users can create jobs" 
on public.jobs for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own jobs" 
on public.jobs for update 
using (auth.uid() = user_id);

-- MESSAGES TABLE
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.users not null,
  recipient_id uuid references public.users not null,
  content text,
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

-- Policies for Messages
create policy "Users can view their own messages" 
on public.messages for select 
using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Users can send messages" 
on public.messages for insert 
with check (auth.uid() = sender_id);

-- Enable Realtime for Messages
alter publication supabase_realtime add table public.messages;
