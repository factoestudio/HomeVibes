const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://mhnnvkekuszxigtoxafb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HaADf1EZDcirYyOHjMrgbQ_HXXvNDwq';

// Helper to make Supabase REST API requests
function supabaseRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
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
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Function to run Ollama analysis using Llama 3.1
function runLlamaAnalysis(testReport) {
  return new Promise((resolve, reject) => {
    const prompt = `You are a Senior Lead Generation & Database Testing Engineer.
Analyze the following test suite execution results for HomeVibes user lead collection, authentication forms, and interest tracking in the Supabase database.

Test Suite Summary:
${JSON.stringify(testReport, null, 2)}

Provide a clear, professional summary answering the user:
1. Are Sign Up, Sign In, B2B forms, and interest tracking successfully creating database records in Supabase?
2. Are all clicks, user preferences, and lead details captured?
3. State key takeaways and verification status clearly.`;

    const payload = JSON.stringify({
      model: 'llama3.1:latest',
      prompt: prompt,
      stream: false
    });

    const req = http.request({
      hostname: '127.0.0.1',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed.response);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', err => reject(err));
    req.write(payload);
    req.end();
  });
}

async function runValidationSuite() {
  console.log('🚀 Running Complete Lead Capture & Auth Validation Suite...');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  // Test 1: B2B Lead Form Submission -> contact_leads
  const b2bPayload = {
    full_name: 'Test Partner Executive',
    company: 'GTA Capital Partners',
    email: `b2b_test_${timestamp}@homevibes-test.com`,
    interest: 'B2B API & Market Intelligence Data Integration',
    source: 'b2b_partner_form_test',
    created_at: new Date().toISOString()
  };
  const res1 = await supabaseRequest('contact_leads', 'POST', b2bPayload);
  results.tests.push({
    name: 'B2B Partner Form Submission',
    table: 'contact_leads',
    status: res1.statusCode >= 200 && res1.statusCode < 300 ? 'SUCCESS' : 'FAILED',
    statusCode: res1.statusCode,
    submittedData: b2bPayload,
    response: res1.data
  });

  // Test 2: User Sign Up Lead Pre-Log -> contact_leads
  const signUpPayload = {
    email: `signup_user_${timestamp}@homevibes-test.com`,
    source: 'user_signup_form_validation',
    created_at: new Date().toISOString()
  };
  const res2 = await supabaseRequest('contact_leads', 'POST', signUpPayload);
  results.tests.push({
    name: 'User Sign Up Form Lead Capture',
    table: 'contact_leads',
    status: res2.statusCode >= 200 && res2.statusCode < 300 ? 'SUCCESS' : 'FAILED',
    statusCode: res2.statusCode,
    submittedData: signUpPayload,
    response: res2.data
  });

  // Test 3: User Sign In Pre-Log -> contact_leads
  const signInPayload = {
    email: `signin_user_${timestamp}@homevibes-test.com`,
    source: 'user_signin_form_validation',
    created_at: new Date().toISOString()
  };
  const res3 = await supabaseRequest('contact_leads', 'POST', signInPayload);
  results.tests.push({
    name: 'User Sign In Lead Logging',
    table: 'contact_leads',
    status: res3.statusCode >= 200 && res3.statusCode < 300 ? 'SUCCESS' : 'FAILED',
    statusCode: res3.statusCode,
    submittedData: signInPayload,
    response: res3.data
  });

  // Test 4: Google OAuth Lead Intent Pre-Log -> contact_leads
  const googlePayload = {
    email: `google_oauth_${timestamp}@homevibes-test.com`,
    source: 'google_oauth_register_intent',
    created_at: new Date().toISOString()
  };
  const res4 = await supabaseRequest('contact_leads', 'POST', googlePayload);
  results.tests.push({
    name: 'Google Register OAuth Intent Lead',
    table: 'contact_leads',
    status: res4.statusCode >= 200 && res4.statusCode < 300 ? 'SUCCESS' : 'FAILED',
    statusCode: res4.statusCode,
    submittedData: googlePayload,
    response: res4.data
  });

  // Test 5: User Click & Interest Analytics Tracking -> user_events
  const eventPayload = {
    event_type: 'VIEW_NEIGHBORHOOD_INTEREST',
    event_data: {
      neighborhood: 'Downtown Oakville & Kerr Village',
      city: 'Oakville',
      interest_level: 'high_intent_unlock',
      commute_anchor: 'Square One, Mississauga',
      timestamp: new Date().toISOString()
    }
  };
  const res5 = await supabaseRequest('user_events', 'POST', eventPayload);
  results.tests.push({
    name: 'User Clicks & Neighborhood Interest Tracking',
    table: 'user_events',
    status: res5.statusCode >= 200 && res5.statusCode < 300 ? 'SUCCESS' : 'FAILED',
    statusCode: res5.statusCode,
    submittedData: eventPayload,
    response: res5.data
  });

  // Query and verify latest records in contact_leads table
  const queryLeads = await supabaseRequest('contact_leads?order=created_at.desc&limit=10', 'GET');
  results.latestLeadsInDatabase = queryLeads.data;

  // Save raw test output
  fs.writeFileSync(path.join(__dirname, '../supabase_test_results.json'), JSON.stringify(results, null, 2), 'utf8');

  console.log('🤖 Running Llama 3.1 analysis on test results...');
  try {
    const llamaAnalysis = await runLlamaAnalysis(results);
    fs.writeFileSync(path.join(__dirname, '../llama31_validation_report.md'), llamaAnalysis, 'utf8');
    console.log('✅ Validation complete! Llama 3.1 report saved to llama31_validation_report.md');
  } catch (err) {
    console.error('Llama3.1 analysis error:', err);
  }
}

runValidationSuite();
