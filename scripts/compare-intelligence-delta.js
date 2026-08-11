/**
 * HomeVibes GTA Intelligence — Delta Detector
 * Compares current gtaMarketIntelligence.json to previous snapshot
 * and computes week-over-week trends: Rising / Stable / Declining
 */

const fs = require('fs');
const path = require('path');

const CURRENT_PATH  = path.join(__dirname, '../data/gtaMarketIntelligence.json');
const SNAPSHOT_DIR  = path.join(__dirname, '../data/snapshots');
const DELTA_PATH    = path.join(__dirname, '../data/gtaMarketIntelligenceDelta.json');

function trend(current, previous, higherIsBetter = true) {
  if (previous == null || current == null) return 'Insufficient Data';
  const delta = current - previous;
  const pct = Math.abs(delta / previous) * 100;
  if (pct < 2) return 'Stable';
  if (higherIsBetter) return delta > 0 ? 'Rising' : 'Declining';
  return delta < 0 ? 'Rising' : 'Declining'; // e.g. fewer days on market = rising demand
}

function arrow(t) {
  return { Rising: '↑', Stable: '→', Declining: '↓', 'Insufficient Data': '?' }[t] || '?';
}

async function main() {
  if (!fs.existsSync(CURRENT_PATH)) {
    console.error('❌ No current intelligence file found. Run harvest-gta-data.js first.');
    process.exit(1);
  }

  const current = JSON.parse(fs.readFileSync(CURRENT_PATH, 'utf8'));

  // Find the most recent snapshot
  if (!fs.existsSync(SNAPSHOT_DIR)) fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  const snapshots = fs.readdirSync(SNAPSHOT_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse();

  let previous = null;
  if (snapshots.length > 0) {
    previous = JSON.parse(fs.readFileSync(path.join(SNAPSHOT_DIR, snapshots[0]), 'utf8'));
    console.log(`📂 Comparing against snapshot: ${snapshots[0]}`);
  } else {
    console.log('⚠️  No previous snapshot found. This is the baseline run — saving snapshot only.');
  }

  const delta = {
    meta: {
      generatedAt: new Date().toISOString(),
      comparedTo: snapshots[0] || 'baseline',
      note: previous ? 'Week-over-week deltas computed' : 'Baseline snapshot — no deltas available yet'
    },
    neighborhoods: current.neighborhoods.map(hood => {
      const prev = previous?.neighborhoods.find(n => n.id === hood.id);
      const priceDelta    = prev ? hood.priceSqFtBuy - prev.priceSqFtBuy : null;
      const sentDelta     = prev ? hood.sentimentScore - prev.sentimentScore : null;
      const devDelta      = prev ? hood.devApplicationsActive - prev.devApplicationsActive : null;
      const velocityTrend = trend(hood.demandVelocityDays, prev?.demandVelocityDays, false);
      const priceTrend    = trend(hood.priceSqFtBuy, prev?.priceSqFtBuy, true);
      const sentTrend     = trend(hood.sentimentScore, prev?.sentimentScore, true);
      const overallTrend  = [priceTrend, sentTrend, velocityTrend]
        .filter(t => t !== 'Insufficient Data')
        .reduce((acc, t) => {
          if (t === 'Rising') acc.rising++;
          else if (t === 'Declining') acc.declining++;
          return acc;
        }, { rising: 0, declining: 0 });

      const overall = overallTrend.rising > overallTrend.declining ? 'Rising'
        : overallTrend.declining > overallTrend.rising ? 'Declining'
        : previous ? 'Stable' : 'Baseline';

      return {
        id: hood.id,
        name: hood.name,
        overallTrend: overall,
        overallArrow: arrow(overall),
        metrics: {
          priceSqFt: {
            current: hood.priceSqFtBuy,
            previous: prev?.priceSqFtBuy ?? null,
            change: priceDelta,
            trend: priceTrend,
            arrow: arrow(priceTrend)
          },
          sentiment: {
            current: hood.sentimentScore,
            previous: prev?.sentimentScore ?? null,
            change: sentDelta,
            trend: sentTrend,
            arrow: arrow(sentTrend)
          },
          demandVelocity: {
            current: hood.demandVelocityDays,
            previous: prev?.demandVelocityDays ?? null,
            trend: velocityTrend,
            arrow: arrow(velocityTrend)
          },
          devApplications: {
            current: hood.devApplicationsActive,
            previous: prev?.devApplicationsActive ?? null,
            change: devDelta,
          }
        }
      };
    })
  };

  // Save delta
  fs.writeFileSync(DELTA_PATH, JSON.stringify(delta, null, 2));

  const dashDir = path.join(__dirname, '../dashboard/data');
  if (!fs.existsSync(dashDir)) fs.mkdirSync(dashDir, { recursive: true });
  fs.copyFileSync(DELTA_PATH, path.join(dashDir, 'gtaMarketIntelligenceDelta.json'));

  console.log(`✅ Delta report written to: ${DELTA_PATH} and synced to dashboard/data/`);

  // Save current as new snapshot
  const snapshotName = `snapshot_${new Date().toISOString().split('T')[0]}.json`;
  fs.copyFileSync(CURRENT_PATH, path.join(SNAPSHOT_DIR, snapshotName));
  console.log(`📸 Snapshot saved: ${snapshotName}`);

  // Print summary table
  console.log('\n📊 GTA Intelligence Delta Summary — Toronto Sprint 1');
  console.log('='.repeat(72));
  console.log('Neighborhood'.padEnd(35) + 'Overall  Price/sqft  Sentiment  Velocity');
  console.log('-'.repeat(72));
  delta.neighborhoods.forEach(n => {
    const m = n.metrics;
    console.log(
      n.name.padEnd(35) +
      (n.overallArrow + ' ' + n.overallTrend).padEnd(9) +
      (m.priceSqFt.arrow + ' $' + (m.priceSqFt.current || '-')).padEnd(12) +
      (m.sentiment.arrow + ' ' + (m.sentiment.current ?? '-')).padEnd(11) +
      (m.demandVelocity.arrow + ' ' + (m.demandVelocity.current ?? '-') + 'd')
    );
  });
  console.log('='.repeat(72));
}

main().catch(err => {
  console.error('❌ Delta error:', err.message);
  process.exit(1);
});
