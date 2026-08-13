-- Supabase Lead Capture & Click Tracking RLS Fix
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/mhnnvkekuszxigtoxafb/sql/new

-- OPTION A: Disable RLS on lead tables (Recommended for maximum lead capture, 0 policy errors)
ALTER TABLE contact_leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_events DISABLE ROW LEVEL SECURITY;

-- OPTION B: Open insert & select policies for anon and authenticated roles
-- ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Allow public all insert contact_leads" ON contact_leads;
-- CREATE POLICY "Allow public all insert contact_leads" ON contact_leads FOR INSERT WITH CHECK (true);
-- DROP POLICY IF EXISTS "Allow public all select contact_leads" ON contact_leads;
-- CREATE POLICY "Allow public all select contact_leads" ON contact_leads FOR SELECT USING (true);

-- ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Allow public all insert user_events" ON user_events;
-- CREATE POLICY "Allow public all insert user_events" ON user_events FOR INSERT WITH CHECK (true);
-- DROP POLICY IF EXISTS "Allow public all select user_events" ON user_events;
-- CREATE POLICY "Allow public all select user_events" ON user_events FOR SELECT USING (true);
