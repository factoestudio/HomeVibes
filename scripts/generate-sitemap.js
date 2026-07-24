const fs = require('fs');
const path = require('path');

const domain = 'https://homevibes.app';

// 1. Static URLs
const staticUrls = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/insights', priority: '0.9', changefreq: 'daily' },
  { url: '/privacy', priority: '0.3', changefreq: 'monthly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' }
];

// 2. Extract Slugs from blogPosts.js
const blogFilePath = path.join(__dirname, '../src/data/blogPosts.js');
const blogContent = fs.readFileSync(blogFilePath, 'utf8');
const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
let match;
const blogUrls = [];

while ((match = slugRegex.exec(blogContent)) !== null) {
  blogUrls.push({
    url: `/insights/${match[1]}`,
    priority: '0.8',
    changefreq: 'weekly'
  });
}

const allUrls = [...staticUrls, ...blogUrls];

// 3. Build XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(item => `  <url>
    <loc>${domain}${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

// 4. Write to public/sitemap.xml
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, xml);
console.log(`✅ Sitemap successfully generated with ${allUrls.length} URLs at ${sitemapPath}`);
