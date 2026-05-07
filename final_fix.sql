-- COMPREHENSIVE FINAL FIX SCHEMA & RPCs (V16 - The Absolute Completion)
-- This script ensures all tables, columns, security, and performance logic exist.
-- Optimized for "Unindexed Foreign Keys", "Anonymous Access Policies", and "Auth RLS Initialization Plan".

-- 1. EXTENDED USERS TABLE
create table if not exists public.users (
    id uuid references auth.users not null primary key,
    email text,
    full_name text,
    user_type text, -- 'customer', 'worker', 'supervisor'
    avatar_url text,
    profile_image_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.users enable row level security;

-- 2. WORKER PROFILES
create table if not exists public.worker_profiles (
  id uuid references public.users not null primary key,
  user_id uuid references public.users not null unique,
  skills text[],
  bio text,
  hourly_rate numeric,
  location text,
  average_rating numeric default 0,
  created_at timestamptz default now()
);

alter table public.worker_profiles enable row level security;

-- 3. CUSTOMER PROFILES
create table if not exists public.customer_profiles (
    id uuid default gen_random_uuid () primary key,
    user_id uuid references public.users not null unique,
    company_name text,
    business_type text,
    company_description text,
    is_business_account boolean default false,
    verification_status text default 'unverified',
    total_jobs_posted integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.customer_profiles enable row level security;

-- 4. JOBS TABLE
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references public.users, 
  worker_id uuid references public.users,
  title text not null,
  description text,
  category text,
  job_type text, -- 'spot', 'scheduled'
  budget numeric,
  urgency_level text,
  location_address text,
  status text default 'open', -- 'open', 'assigned', 'in_progress', 'completed'
  images text[],
  voice_note_url text,
  scheduled_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.jobs enable row level security;

-- 5. JOB TRACKING
create table if not exists public.job_tracking (
    id uuid default gen_random_uuid () primary key,
    job_id uuid references public.jobs not null unique,
    otp_code text,
    started_at timestamptz,
    completed_at timestamptz,
    current_location jsonb,
    updated_at timestamptz default now()
);

alter table public.job_tracking enable row level security;

-- 6. MESSAGES
create table if not exists public.messages (
    id uuid default gen_random_uuid () primary key,
    job_id uuid references public.jobs,
    sender_id uuid references public.users not null,
    recipient_id uuid references public.users not null,
    content text,
    is_read boolean default false,
    created_at timestamptz default now()
);

alter table public.messages enable row level security;

-- 7. REVIEWS
create table if not exists public.reviews (
    id uuid default gen_random_uuid () primary key,
    job_id uuid references public.jobs not null unique,
    reviewer_id uuid references public.users not null,
    reviewee_id uuid references public.users not null,
    rating integer check (
        rating >= 1
        and rating <= 5
    ),
    review_text text,
    created_at timestamptz default now()
);

alter table public.reviews enable row level security;

-- 8. JOB MEDIA
create table if not exists public.job_media (
    id uuid default gen_random_uuid () primary key,
    job_id uuid references public.jobs on delete cascade,
    media_url text not null,
    media_type text, -- 'image', 'video'
    created_at timestamptz default now()
);

alter table public.job_media enable row level security;

-- 9. JOB STATUS HISTORY
create table if not exists public.job_status_history (
    id uuid default gen_random_uuid () primary key,
    job_id uuid references public.jobs on delete cascade,
    status text not null,
    changed_by uuid references public.users,
    changed_at timestamptz default now()
);

alter table public.job_status_history enable row level security;

-- 10. COVERING INDEXES (Performance Fix)
-- Ensuring all foreign keys have indexes to satisfy the "Unindexed Foreign Keys" linter.
create index if not exists idx_users_id on public.users (id);

create index if not exists idx_worker_profiles_user_id on public.worker_profiles (user_id);

create index if not exists idx_customer_profiles_user_id on public.customer_profiles (user_id);

create index if not exists idx_jobs_customer_id on public.jobs (customer_id);

create index if not exists idx_jobs_worker_id on public.jobs (worker_id);

create index if not exists idx_job_tracking_job_id on public.job_tracking (job_id);

create index if not exists idx_messages_job_id on public.messages (job_id);

create index if not exists idx_messages_sender_id on public.messages (sender_id);

create index if not exists idx_messages_recipient_id on public.messages (recipient_id);

create index if not exists idx_reviews_job_id on public.reviews (job_id);

create index if not exists idx_reviews_reviewer_id on public.reviews (reviewer_id);

create index if not exists idx_reviews_reviewee_id on public.reviews (reviewee_id);

create index if not exists idx_job_media_job_id on public.job_media (job_id);

create index if not exists idx_job_status_history_job_id on public.job_status_history (job_id);

create index if not exists idx_job_status_history_changed_by on public.job_status_history (changed_by);

-- 11. RPC FUNCTIONS (Secured)
create or replace function public.assign_job_to_worker(p_job_id uuid, p_worker_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_otp text;
begin
  v_otp := lpad(floor(random() * 10000)::text, 4, '0');
  update jobs set worker_id = p_worker_id, status = 'assigned', updated_at = now() where id = p_job_id;
  insert into job_tracking (job_id, otp_code, updated_at) values (p_job_id, v_otp, now())
  on conflict (job_id) do update set otp_code = v_otp, updated_at = now();
  return v_otp;
end; $$;

create or replace function public.verify_job_start(p_job_id uuid, p_input_otp text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from job_tracking where job_id = p_job_id and otp_code = p_input_otp) then
    update jobs set status = 'in_progress', updated_at = now() where id = p_job_id;
    update job_tracking set started_at = now(), updated_at = now() where job_id = p_job_id;
    return true;
  end if;
  return false;
end; $$;

create or replace function public.update_location(p_job_id uuid, p_lat numeric, p_lng numeric)
returns void language plpgsql security definer set search_path = public as $$
begin
  update job_tracking set current_location = jsonb_build_object('lat', p_lat, 'lng', p_lng), updated_at = now() where job_id = p_job_id;
end; $$;

-- 12. CONSOLIDATED & OPTIMIZED POLICIES
-- DROP ALL EXISTING POLICIES IN PUBLIC SCHEMA
do $$ declare r record; begin
    for r in (select policyname, tablename from pg_policies where schemaname = 'public') loop
        execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
    end loop;
end $$;

-- MASTER SHIELD (RESTRICTIVE) - Ironclad protection against anonymous users.
create policy "Shield_Users" on public.users as restrictive to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

create policy "Shield_Workers" on public.worker_profiles as restrictive to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

create policy "Shield_Customers" on public.customer_profiles as restrictive to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

create policy "Shield_Jobs" on public.jobs as restrictive to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

create policy "Shield_Tracking" on public.job_tracking as restrictive to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

create policy "Shield_Messages" on public.messages as restrictive to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

create policy "Shield_Reviews" on public.reviews as restrictive to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

create policy "Shield_JobMedia" on public.job_media as restrictive to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

create policy "Shield_JobHistory" on public.job_status_history as restrictive to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

-- PERMISSIVE POLICIES
-- USERS
create policy "Users_Select" on public.users for select to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

create policy "Users_Insert_Own" on public.users for insert to authenticated with check (((select auth.uid()) = id) AND (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true));

create policy "Users_Update_Own" on public.users for update to authenticated using (((select auth.uid()) = id) AND (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true));

-- WORKERS
create policy "Workers_Select" on public.worker_profiles for select to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

create policy "Workers_Insert_Own" on public.worker_profiles for insert to authenticated with check (((select auth.uid()) = id) AND (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true));

create policy "Workers_Update_Own" on public.worker_profiles for update to authenticated using (((select auth.uid()) = id) AND (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true));

create policy "Workers_Delete_Own" on public.worker_profiles for delete to authenticated using (((select auth.uid()) = id) AND (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true));

-- CUSTOMERS
create policy "Customers_Select" on public.customer_profiles for select to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

create policy "Customers_Insert_Own" on public.customer_profiles for insert to authenticated with check (((select auth.uid()) = user_id) AND (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true));

create policy "Customers_Update_Own" on public.customer_profiles for update to authenticated using (((select auth.uid()) = user_id) AND (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true));

create policy "Customers_Delete_Own" on public.customer_profiles for delete to authenticated using (((select auth.uid()) = user_id) AND (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true));

-- JOBS
create policy "Jobs_Select" on public.jobs for select to authenticated using (
    (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true)
    AND (
        status = 'open' 
        OR customer_id = (select auth.uid()) 
        OR worker_id = (select auth.uid()) 
        OR (select user_type from public.users where id = (select auth.uid())) = 'supervisor'
    )
);

create policy "Jobs_Insert_Own" on public.jobs for insert to authenticated with check (
    (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true)
    AND (
        customer_id = (select auth.uid()) 
        OR (select user_type from public.users where id = (select auth.uid())) = 'supervisor'
    )
);

create policy "Jobs_Update_Own" on public.jobs for update to authenticated using (
    (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true)
    AND (
        customer_id = (select auth.uid()) 
        OR worker_id = (select auth.uid()) 
        OR (select user_type from public.users where id = (select auth.uid())) = 'supervisor'
    )
);

create policy "Jobs_Delete_Own" on public.jobs for delete to authenticated using (
    (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true)
    AND (
        customer_id = (select auth.uid()) 
        OR (select user_type from public.users where id = (select auth.uid())) = 'supervisor'
    )
);

-- TRACKING
create policy "Tracking_Select" on public.job_tracking for select to authenticated using (
    (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true)
    AND exists (
        select 1 from public.jobs 
        where id = job_tracking.job_id 
        and (customer_id = (select auth.uid()) or worker_id = (select auth.uid()))
    )
);

create policy "Tracking_Update_Own" on public.job_tracking for update to authenticated using (
    (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true)
    AND exists (
        select 1 from public.jobs 
        where id = job_tracking.job_id 
        and worker_id = (select auth.uid())
    )
);

create policy "Tracking_Insert_Own" on public.job_tracking for insert to authenticated with check (
    (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true)
    AND exists (
        select 1 from public.jobs 
        where id = job_tracking.job_id 
        and worker_id = (select auth.uid())
    )
);

-- MESSAGES
create policy "Messages_Exchange" on public.messages for all to authenticated using (
    (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true)
    AND ((select auth.uid()) = sender_id or (select auth.uid()) = recipient_id)
);

-- REVIEWS
create policy "Reviews_Select" on public.reviews for select to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

create policy "Reviews_Insert_Own" on public.reviews for insert to authenticated with check (
    (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true)
    AND reviewer_id = (select auth.uid())
);

-- AUDIT TABLES
create policy "Job_Media_Select" on public.job_media for select to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

create policy "Job_Status_History_Select" on public.job_status_history for select to authenticated using (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true);

-- 13. MASTER HARDENING (Air-Gap)
-- Revoke USAGE on schema public from anon entirely.
-- This prevents the 'anon' role from even initiating queries against your public tables.
revoke all on schema public from anon;

revoke all on schema cron from public, authenticated, anon;

revoke all on schema storage from public, authenticated, anon;

revoke all on all tables in schema public from anon;

-- Storage Policies
insert into
    storage.buckets (id, name, public)
values (
        'job-media',
        'job-media',
        true
    ) on conflict (id) do nothing;

drop policy if exists "Job Media Shield" on storage.objects;

create policy "Job Media Shield" on storage.objects as restrictive to authenticated using (bucket_id = 'job-media' and (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true));

drop policy if exists "Job Media Secure Select" on storage.objects;

create policy "Job Media Secure Select" on storage.objects for select to authenticated using (bucket_id = 'job-media' and (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true));

drop policy if exists "Users can upload job media" on storage.objects;

create policy "Users can upload job media" on storage.objects for insert to authenticated with check (bucket_id = 'job-media' and (((select auth.jwt()) ->> 'is_anonymous')::boolean is not true));

-- 14. REALTIME
do $$ begin
  begin alter publication supabase_realtime add table public.jobs;

exception when others then null;

end;

begin alter publication supabase_realtime add table public.job_tracking; exception when others then null; end;

begin alter publication supabase_realtime add table public.messages; exception when others then null; end;

begin alter publication supabase_realtime add table public.users; exception when others then null; end;

end $$;

-- 15. CLEANUP
drop table if exists public.job cascade;

drop table if exists public.profiles cascade;