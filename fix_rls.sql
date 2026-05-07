-- Copy and paste this ONE line into your Supabase SQL Editor and click RUN.
-- This fixes the "new row violates row-level security policy" error.

CREATE POLICY "Enable insert for authenticated users only" ON "public"."users" AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));