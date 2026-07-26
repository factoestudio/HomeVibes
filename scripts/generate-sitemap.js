const fs = require('fs');
const path = require('path');

const domain = 'https://homevibes.app';

// 1. Core Static URLs
const staticUrls = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/insights', priority: '0.9', changefreq: 'daily' },
  { url: '/privacy', priority: '0.3', changefreq: 'monthly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' }
];

// 2. Programmatic Neighborhood URLs from neighborhoodsData.js
const nDataPath = path.join(__dirname, '../src/data/neighborhoodsData.js');
const nDataContent = fs.readFileSync(nDataPath, 'utf8');
const idRegex = /id:\s*['"]([^'"]+)['"]/g;
let nMatch;
const neighborhoodUrls = [];
const neighborhoodIds = [];

while ((nMatch = idRegex.exec(nDataContent)) !== null) {
  const nid = nMatch[1];
  if (!neighborhoodIds.includes(nid)) {
    neighborhoodIds.push(nid);
    neighborhoodUrls.push({
      url: `/neighborhoods/${nid}`,
      priority: '0.8',
      changefreq: 'weekly'
    });
  }
}

// 3. Programmatic Comparison URLs (Top High-Intent Pairings)
const comparisonPairs = [
  'junction-vs-leslieville',
  'king-west-vs-liberty-village',
  'waterfront-vs-cityplace',
  'yorkville-vs-annex',
  'roncesvalles-vs-high-park',
  'danforth-vs-beach',
  'yonge-eglinton-vs-davisville'
];

const comparisonUrls = comparisonPairs.map(pair => ({
  url: `/compare/${pair}`,
  priority: '0.7',
  changefreq: 'weekly'
}));

// 4. Programmatic Lifestyle Guides
const guideSlugs = [
  'best-toronto-neighborhoods-for-remote-workers',
  'best-toronto-neighborhoods-for-families',
  'toronto-transit-friendly-neighborhoods',
  'toronto-walkable-artisan-enclaves'
];

const guideUrls = guideSlugs.map(slug => ({
  url: `/guides/${slug}`,
  priority: '0.7',
  changefreq: 'weekly'
}));

// 5. Blog Post URLs from blogPosts.js
const blogFilePath = path.join(__dirname, '../src/data/blogPosts.js');
const blogContent = fs.readFileSync(blogFilePath, 'utf8');
const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
let bMatch;
const blogUrls = [];

while ((bMatch = slugRegex.exec(blogContent)) !== null) {
  blogUrls.push({
    url: `/insights/${bMatch[1]}`,
    priority: '0.8',
    changefreq: 'weekly'
  });
}

const allUrls = [
  ...staticUrls,
  ...neighborhoodUrls,
  ...comparisonUrls,
  ...guideUrls,
  ...blogUrls
];

// 6. Build XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(item => `  <url>
    <loc>${domain}${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

// 7. Write to public/sitemap.xml
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, xml);
console.log(`✅ Sitemap successfully generated with ${allUrls.length} pSEO URLs at ${sitemapPath}`);
