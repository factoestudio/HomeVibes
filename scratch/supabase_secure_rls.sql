-- 🔐 ENTERPRISE SECURE ROW-LEVEL SECURITY (RLS) FOR HOMEVIBES
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/mhnnvkekuszxigtoxafb/sql/new
-- Resolves all Supabase Critical Security warnings & prevents anonymous reading of user leads.

-- 1. Re-enable RLS on contact_leads
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

-- Clean up any existing policy names
DROP POLICY IF EXISTS "Allow public insert on contact_leads" ON contact_leads;
DROP POLICY IF EXISTS "Allow authenticated select on contact_leads" ON contact_leads;
DROP POLICY IF EXISTS "Allow public all insert contact_leads" ON contact_leads;
DROP POLICY IF EXISTS "Allow public all select contact_leads" ON contact_leads;
DROP POLICY IF EXISTS "Enable public insert for leads" ON contact_leads;
DROP POLICY IF EXISTS "Enable select for authenticated users only" ON contact_leads;

-- Policy A: Allow ANY visitor to submit leads (Sign Up, Sign In, B2B, Unlocks)
CREATE POLICY "Enable public insert for leads" 
ON contact_leads 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Policy B: Block anonymous users from reading lead data (Authenticated/Admin only)
CREATE POLICY "Enable select for authenticated users only" 
ON contact_leads 
FOR SELECT 
TO authenticated 
USING (true);

-- 2. Re-enable RLS on user_events
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- Clean up any existing policy names
DROP POLICY IF EXISTS "Allow public insert on user_events" ON user_events;
DROP POLICY IF EXISTS "Allow authenticated select on user_events" ON user_events;
DROP POLICY IF EXISTS "Allow public all insert user_events" ON user_events;
DROP POLICY IF EXISTS "Allow public all select user_events" ON user_events;
DROP POLICY IF EXISTS "Enable public insert for events" ON user_events;
DROP POLICY IF EXISTS "Enable select for authenticated users only" ON user_events;

-- Policy A: Allow ANY visitor to log click & analytics events
CREATE POLICY "Enable public insert for events" 
ON user_events 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Policy B: Block anonymous users from reading analytics logs (Authenticated/Admin only)
CREATE POLICY "Enable select for authenticated users only" 
ON user_events 
FOR SELECT 
TO authenticated 
USING (true);
