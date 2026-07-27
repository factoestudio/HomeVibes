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

// 2. Programmatic Neighborhood URLs from neighborhoodsData.js (excluding listing IDs)
const nDataPath = path.join(__dirname, '../src/data/neighborhoodsData.js');
const nDataContent = fs.readFileSync(nDataPath, 'utf8');
const idRegex = /id:\s*['"]([^'"]+)['"]/g;
let nMatch;
const neighborhoodUrls = [];
const neighborhoodIds = [];

// Listing ID pattern (e.g. dt-r1, lv-b2, sb-b1, etc.)
const listingIdPattern = /^[a-z]{2,3}-[rb]\d+$/;

while ((nMatch = idRegex.exec(nDataContent)) !== null) {
  const nid = nMatch[1];
  if (!listingIdPattern.test(nid) && !neighborhoodIds.includes(nid)) {
    neighborhoodIds.push(nid);
    neighborhoodUrls.push({
      url: `/neighborhoods/${nid}`,
      priority: '0.8',
      changefreq: 'weekly'
    });
  }
}

// 3. Programmatic Comparison URLs (Top 55 High-Intent Pairings)
const comparisonPairs = [
  'junction-vs-leslieville',
  'king-west-vs-liberty-village',
  'waterfront-vs-cityplace',
  'yorkville-vs-annex',
  'roncesvalles-vs-high-park',
  'danforth-vs-the-beaches',
  'yonge-eglinton-vs-davisville',
  'port-credit-vs-bronte-harbour',
  'unionville-vs-cornell',
  'willowdale-vs-vaughan-vmc',
  'mimico-waterfront-vs-port-credit',
  'leslieville-vs-the-beaches',
  'downtown-toronto-vs-yorkville',
  'liberty-village-vs-ossington-trinity',
  'streetsville-vs-port-credit',
  'downtown-brampton-vs-square-one',
  'old-oakville-vs-bronte-harbour',
  'richmond-hill-heritage-vs-unionville',
  'scarborough-bluffs-vs-the-beaches',
  'vaughan-vmc-vs-square-one',
  'ossington-trinity-vs-roncesvalles',
  'king-west-vs-downtown-toronto',
  'willowdale-vs-richmond-hill-heritage',
  'cityplace-vs-liberty-village',
  'high-park-vs-roncesvalles',
  'leslieville-vs-ossington-trinity',
  'junction-vs-roncesvalles',
  'yorkville-vs-king-west',
  'waterfront-vs-mimico-waterfront',
  'port-credit-vs-square-one',
  'unionville-vs-willowdale',
  'downtown-toronto-vs-liberty-village',
  'the-beaches-vs-port-credit',
  'old-oakville-vs-port-credit',
  'vaughan-vmc-vs-willowdale',
  'cornell-vs-richmond-hill-heritage',
  'scarborough-bluffs-vs-leslieville',
  'downtown-brampton-vs-streetsville',
  'bronte-harbour-vs-port-credit',
  'high-park-vs-the-beaches',
  'king-west-vs-ossington-trinity',
  'the-danforth-vs-leslieville',
  'downtown-toronto-vs-willowdale',
  'port-credit-vs-old-oakville',
  'yorkville-vs-leslieville',
  'liberty-village-vs-waterfront',
  'mimico-waterfront-vs-high-park',
  'streetsville-vs-square-one',
  'vaughan-vmc-vs-richmond-hill-heritage',
  'cornell-vs-unionville',
  'scarborough-bluffs-vs-port-credit',
  'bronte-harbour-vs-old-oakville',
  'high-park-vs-junction',
  'king-west-vs-yorkville',
  'the-danforth-vs-the-beaches'
];

const comparisonUrls = comparisonPairs.map(pair => ({
  url: `/compare/${pair}`,
  priority: '0.7',
  changefreq: 'weekly'
}));

// 4. Programmatic Lifestyle Guides from guidesData.js
const guideFilePath = path.join(__dirname, '../src/data/guidesData.js');
const guideContent = fs.readFileSync(guideFilePath, 'utf8');
const guideSlugRegex = /slug:\s*['"]([^'"]+)['"]/g;
let gMatch;
const guideUrls = [];

while ((gMatch = guideSlugRegex.exec(guideContent)) !== null) {
  guideUrls.push({
    url: `/guides/${gMatch[1]}`,
    priority: '0.7',
    changefreq: 'weekly'
  });
}

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
