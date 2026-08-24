const http = require('http');
const fs = require('fs');
const path = require('path');

const prompt = `You are a Principal Product Designer & Monetization Architect specializing in ultra-luxury, Apple-inspired Web Apps (clean typography, dark mode glassmorphism, high trust, zero visual clutter).

CONTEXT:
HomeVibes (homevibes.app) is an AI-powered lifestyle & neighborhood match engine for the Greater Toronto Area (Toronto, Peel, York, Halton, Durham).
The UI is built with React, Tailwind/CSS variables, Leaflet maps, and sleek glassmorphism panels.

The Founder wants to sell SUBTLE, HIGH-VALUE SPACES to regional advertisers (e.g. boutique developers, top GTA mortgage specialists, high-end interior architects, reputable local realtors, moving & home services) WITHOUT compromising the premium aesthetic of the site (NO ugly Google AdSense banners, NO blinking popups, NO spammy widgets).

ANALYZE THE KEY PAGES & PROPOSE SPECIFIC, SUBTLE SPONSORSHIP / AD PLACEMENTS:

1. RESULTS VIEW & NEIGHBORHOOD DETAILS:
   - Where in the 3-column layout (Neighborhood List, Interactive Map, Neighborhood Details Panel) can a sponsored partner card or badge live?
   - How can it be styled to look like an integrated luxury feature rather than an ad? (e.g. "Featured Local Partner", "Neighborhood Mortgage Benchmark", "Exclusive Pre-Con Showcase")

2. MAP VIEW OVERLAYS:
   - Subtle map pin styling or callout card for a verified local developer/partner without cluttering the map.

3. BLOG & MARKET INSIGHTS POSTS:
   - Native contextual partner box inside or at the end of neighborhood articles (e.g., "Exploring homes in The Junction? Connect with our vetted west-end specialist").

4. VIBE QUIZ & MATCH RESULTS TRANSITION:
   - "Curated for you by HomeVibes & [Partner]" or concierge style recommendation.

5. PRICING & SPONSORSHIP PACKAGES:
   - What sponsorship packages can HomeVibes pitch to GTA partners (Exclusive Area Sponsor, Category Partner, Article Sponsor)?

Please provide a detailed, well-structured architectural and design proposal with exact component mockups, CSS/design rules, and revenue models that protect the site's luxury brand.`;

const payload = JSON.stringify({
  model: 'qwen2.5-coder:latest',
  prompt: prompt,
  stream: false
});

console.log('🤖 Querying Qwen 2.5 Coder via Ollama for subtle premium ad strategy...');

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
      fs.writeFileSync(path.join(__dirname, '../qwen_premium_ad_plan.md'), parsed.response, 'utf8');
      console.log('✅ Qwen strategic plan saved to qwen_premium_ad_plan.md');
    } catch (e) {
      console.error('JSON parsing error:', e);
    }
  });
});

req.on('error', err => console.error('Ollama request error:', err));
req.write(payload);
req.end();
