const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mhnnvkekuszxigtoxafb.supabase.co';
const supabaseKey = 'sb_publishable_HaADf1EZDcirYyOHjMrgbQ_HXXvNDwq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  try {
    const { data: leads, error: leadsErr } = await supabase.from('contact_leads').select('*').limit(5);
    console.log('contact_leads result:', { dataLength: leads?.length, error: leadsErr });

    const { data: events, error: eventsErr } = await supabase.from('user_events').select('*').limit(5);
    console.log('user_events result:', { dataLength: events?.length, error: eventsErr });
  } catch (err) {
    console.error('Connection exception:', err);
  }
}

testConnection();
