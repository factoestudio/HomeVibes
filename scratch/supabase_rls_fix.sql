-- Supabase Row-Level Security (RLS) Lead Capture & Event Tracking Fix
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/mhnnvkekuszxigtoxafb/sql)

-- 1. Enable public/anon insert on contact_leads (captures all sign-ups, sign-ins, B2B forms & unlocks)
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on contact_leads" ON contact_leads;
CREATE POLICY "Allow public insert on contact_leads" 
ON contact_leads FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated select on contact_leads" ON contact_leads;
CREATE POLICY "Allow authenticated select on contact_leads" 
ON contact_leads FOR SELECT 
TO authenticated 
USING (true);

-- 2. Enable public/anon insert on user_events (captures all clicks, neighborhood views, city filters)
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on user_events" ON user_events;
CREATE POLICY "Allow public insert on user_events" 
ON user_events FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated select on user_events" ON user_events;
CREATE POLICY "Allow authenticated select on user_events" 
ON user_events FOR SELECT 
TO authenticated 
USING (true);
