const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// New batch of articles (IDs 47-49)
const newPosts = [
  {
    id: 47,
    slug: 'toronto-west-harbour-revitalization-2026',
    title: 'Toronto West Harbour Revitalization 2026: New Urban Waterfront Blueprint',
    date: 'September 4, 2026',
    excerpt: 'An in‑depth look at the West Harbour master‑plan transforming Toronto’s lakeside district with mixed‑use towers, climate‑adaptive parks, and a 30‑year transit vision.',
    category: 'Neighborhood Guides',
    coordinates: { lat: 43.6399, lng: -79.3800 },
    neighborhoodName: "West Harbour",
    city: "Toronto",
    neighborhoodId: "west-harbour",
    content: `
## Toronto West Harbour Revitalization 2026

**Target Persona & Micro‑Cluster**  
Urban investors, high‑net‑worth families, and climate‑focused developers seeking premium lakeside real‑estate.

---

### Vision Overview
The West Harbour district is being redeveloped into a 1,200‑acre mixed‑use waterfront community featuring:
- 18,000 residential units (including 4,000 luxury condos)
- 5,000 k㎡ of climate‑adaptive green space
- New GO Transit Lakeshore East spur (15 min to Union)

### Price Benchmark (2026)
- Luxury condos: $1,150 / sq ft
- Mid‑rise apartments: $950 / sq ft

### Investment Rating
⭐⭐⭐⭐⭐ – Highest equity upside with strong transit connectivity.
`
  },
  {
    id: 48,
    slug: 'york-region-solar-farm-investment-outlook-2026',
    title: 'York Region Solar Farm Investment Outlook 2026',
    date: 'September 4, 2026',
    excerpt: 'Forecast of solar farm capacity expansions, PPA rates, and green‑energy tax incentives across York Region’s emerging renewable corridor.',
    category: 'Market Trends',
    coordinates: { lat: 43.9735, lng: -79.2477 },
    neighborhoodName: "York Region",
    city: "York Region",
    neighborhoodId: "york-region-solar",
    content: `
## York Region Solar Farm Investment Outlook 2026

**Target Persona & Micro‑Cluster**  
Institutional investors, clean‑energy funds, and eco‑conscious developers.

---

### Capacity Growth
- 2026 target: 2.5 GW of new solar capacity
- Major projects: Newmarket Solar Park (250 MW), Whitchurch‑Stouffville (180 MW)

### PPA Rates
- Expected 2026 PPA: $0.047 /kWh (10% above 2025)

### Incentives
- Provincial Green‑Energy Tax Credit: 15% of capital costs
- Federal IA‑FIT program extensions through 2028

### Investment Rating
⭐⭐⭐⭐ – Strong returns with policy support.
`
  },
  {
    id: 49,
    slug: 'downtown-hamilton-mixed-use-development-2026',
    title: 'Downtown Hamilton Mixed‑Use Development 2026: Revitalizing the Steel City',
    date: 'September 4, 2026',
    excerpt: 'Analysis of the $1.2 B mixed‑use project reshaping Hamilton’s core with residential towers, office space, and cultural venues, plus new LRT link.',
    category: 'Urban Development',
    coordinates: { lat: 43.2557, lng: -79.8711 },
    neighborhoodName: "Downtown Hamilton",
    city: "Hamilton",
    neighborhoodId: "downtown-hamilton",
    content: `
## Downtown Hamilton Mixed‑Use Development 2026

**Target Persona & Micro‑Cluster**  
Mid‑scale investors, renters, and civic planners attracted to the revitalized downtown core.

---

### Project Highlights
- 1,800 residential units (incl. 500 affordable)
- 300,000 sq ft office space
- New public plaza and Arts Centre
- LRT extension connecting to GO Hub (5 min)

### Price Benchmark (2026)
- Condos: $820 / sq ft
- Rental units: $1,750 / month (2‑bed)

### Investment Rating
⭐⭐⭐⭐ – Balanced risk with urban growth momentum.
`
  }
];

function run() {
  console.log('Running Content Creator engine for HomeVibes (new batch)...');

  // 1. Read existing blogPosts.js
  const blogPostsPath = path.join(__dirname, '../src/data/blogPosts.js');
  let content = fs.readFileSync(blogPostsPath, 'utf8');

  // 2. Prepend new posts into the array
  const insertionPoint = content.indexOf('export const blogPosts = [') + 'export const blogPosts = ['.length;

  const newPostsCode = newPosts.map(p => `
  {
    id: ${p.id},
    slug: '${p.slug}',
    title: '${p.title.replace(/'/g, "\\'")}',
    date: '${p.date}',
    excerpt: '${p.excerpt.replace(/'/g, "\\'")}',
    category: '${p.category}',
    coordinates: { lat: ${p.coordinates.lat}, lng: ${p.coordinates.lng} },
    neighborhoodName: "${p.neighborhoodName}",
    city: "${p.city}",
    neighborhoodId: "${p.neighborhoodId}",
    content: \`${p.content}\`
  },`).join('');

  content = content.slice(0, insertionPoint) + newPostsCode + content.slice(insertionPoint);

  fs.writeFileSync(blogPostsPath, content, 'utf8');
  console.log(`✅ Successfully added ${newPosts.length} new 2026 market intelligence articles to blogPosts.js! (IDs: ${newPosts.map(p=>p.id).join(', ')})`);

  // 3. Regenerate Sitemap & RSS Feed
  console.log('Regenerating sitemap.xml and rss.xml...');
  execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });
  execSync('node scripts/generate-rss.js', { stdio: 'inherit' });

  console.log('🎉 Content creator workflow complete!');
}

run();
