-- FIX: Rename user_id to customer_id to match Codebase
alter table public.jobs 
  rename column user_id to customer_id;

-- FIX: Add missing columns required by jobService.ts
alter table public.jobs 
  add column scheduled_date timestamptz,
  add column images text[], -- Array of image URLs
  add column voice_note_url text,
  add column updated_at timestamptz default now();

-- Update Policies to reflect column rename
-- (Supabase might handle rename, but re-applying policy ensures clarity)
drop policy if exists "Users can create jobs" on public.jobs;
create policy "Users can create jobs" 
on public.jobs for insert 
with check (auth.uid() = customer_id);

drop policy if exists "Users can update their own jobs" on public.jobs;
create policy "Users can update their own jobs" 
on public.jobs for update 
using (auth.uid() = customer_id);

-- Create Storage Bucket for Job Media if not exists
insert into storage.buckets (id, name, public) 
values ('job-media', 'job-media', true)
on conflict (id) do nothing;

create policy "Job Media Public Access"
on storage.objects for select
using ( bucket_id = 'job-media' );

create policy "Users can upload job media"
on storage.objects for insert
with check ( bucket_id = 'job-media' and auth.role() = 'authenticated' );
