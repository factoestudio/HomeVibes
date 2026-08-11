/**
 * Merges sprintone_sentiment.json into gtaMarketIntelligence.json
 * Maps by neighborhood ID (slug) matching against the neighborhood name
 */
const fs = require('fs');
const path = require('path');

const INTEL_PATH    = path.join(__dirname, '../data/gtaMarketIntelligence.json');
const FULL_SENT_PATH = path.join(__dirname, '../data/full_gta_sentiment.json');
const SPRINT_SENT_PATH = path.join(__dirname, '../data/sprintone_sentiment.json');

const intel = JSON.parse(fs.readFileSync(INTEL_PATH, 'utf8'));

let sentList = [];
if (fs.existsSync(FULL_SENT_PATH)) {
  sentList = JSON.parse(fs.readFileSync(FULL_SENT_PATH, 'utf8'));
  console.log(`📂 Using full GTA sentiment file: ${FULL_SENT_PATH}`);
} else if (fs.existsSync(SPRINT_SENT_PATH)) {
  sentList = JSON.parse(fs.readFileSync(SPRINT_SENT_PATH, 'utf8'));
  console.log(`📂 Using sprint sentiment file: ${SPRINT_SENT_PATH}`);
}

// Build lookup by normalized name
const sentMap = {};
sentList.forEach(s => {
  const name = s.neighborhood || s.name || '';
  const key = name.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
  if (key) sentMap[key] = s;
});

let merged = 0;
intel.neighborhoods = intel.neighborhoods.map(hood => {
  const key = hood.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  let sent = sentMap[key];
  if (!sent) {
    // Fuzzy match by checking if name includes or is included in key
    const matchKey = Object.keys(sentMap).find(k => k.includes(key.split(' ')[0]) || key.includes(k.split(' ')[0]) || (hood.id.includes('brampton') && k.includes('brampton')) || (hood.id.includes('vaughan') && k.includes('vaughan')));
    if (matchKey) sent = sentMap[matchKey];
  }
  if (sent) {
    merged++;
    return {
      ...hood,
      sentimentScore:    sent.score,
      sentimentLabel:    sent.sentiment,
      sentimentSummary:  sent.summary,
      topThemes:         sent.topThemes || [],
      concerns:          sent.concerns  || [],
      sentimentCitations: (sent.sources || []).map(src => typeof src === 'string' ? { platform: src, date: sent.scanDate?.split('T')[0] } : src),
    };
  }
  return hood;
});

// Update meta
intel.meta.generatedAt   = new Date().toISOString();
intel.meta.sentimentMergedAt = new Date().toISOString();
if (!intel.meta.sources.find(s => s.name === 'Web Search + Llama3 Sentiment')) {
  intel.meta.sources.push({ name: 'Web Search + Llama3 Sentiment', model: 'llama3:latest', mergedAt: new Date().toISOString(), neighborhoods: merged });
}

fs.writeFileSync(INTEL_PATH, JSON.stringify(intel, null, 2));

const dashDir = path.join(__dirname, '../dashboard/data');
if (!fs.existsSync(dashDir)) fs.mkdirSync(dashDir, { recursive: true });
fs.copyFileSync(INTEL_PATH, path.join(dashDir, 'gtaMarketIntelligence.json'));

console.log(`✅ Merged sentiment for ${merged}/${intel.neighborhoods.length} neighborhoods (synced to dashboard/data/)`);
intel.neighborhoods.forEach(h => {
  const icon = h.sentimentScore >= 80 ? '🟢' : h.sentimentScore >= 70 ? '🟡' : '🔴';
  console.log(`  ${icon} ${h.name}: ${h.sentimentScore}/100 (${h.sentimentLabel})`);
});
