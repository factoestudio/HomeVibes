const https = require('https');

const SUPABASE_URL = 'https://mhnnvkekuszxigtoxafb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HaADf1EZDcirYyOHjMrgbQ_HXXvNDwq';

function supabaseRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: body });
        }
      });
    });

    req.on('error', err => reject(err));
    req.end();
  });
}

async function fetchTrafficMetrics() {
  console.log('📊 Fetching HomeVibes Traffic & Event Analytics...');

  try {
    const leadsRes = await supabaseRequest('contact_leads?select=*&order=created_at.desc');
    const eventsRes = await supabaseRequest('user_events?select=*&order=created_at.desc');

    const leads = Array.isArray(leadsRes.data) ? leadsRes.data : [];
    const events = Array.isArray(eventsRes.data) ? eventsRes.data : [];

    console.log(`\n--- 🏆 TRAFFIC & LEAD SUMMARY ---`);
    console.log(`Total Captured Leads in Supabase: ${leads.length}`);
    console.log(`Total Tracked User Events in Supabase: ${events.length}`);

    // Event type breakdown
    const eventBreakdown = {};
    events.forEach(e => {
      const type = e.event_type || 'UNKNOWN';
      eventBreakdown[type] = (eventBreakdown[type] || 0) + 1;
    });

    console.log('\n--- 📈 USER EVENT BREAKDOWN ---');
    console.table(eventBreakdown);

    // Lead source breakdown
    const leadSources = {};
    leads.forEach(l => {
      const src = l.source || 'Direct';
      leadSources[src] = (leadSources[src] || 0) + 1;
    });

    console.log('\n--- 🎯 LEAD SOURCE BREAKDOWN ---');
    console.table(leadSources);

    // Recent 5 leads
    console.log('\n--- ⏱️ LATEST 5 CAPTURED LEADS ---');
    leads.slice(0, 5).forEach((l, i) => {
      console.log(`${i + 1}. [${l.created_at}] Email: ${l.email || 'N/A'} | Source: ${l.source} | Location: ${l.neighborhood || 'GTA'}`);
    });

  } catch (err) {
    console.error('Error fetching traffic metrics:', err);
  }
}

fetchTrafficMetrics();
