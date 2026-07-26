const fs = require('fs');
const path = require('path');

const domain = 'https://homevibes.app';

const blogFilePath = path.join(__dirname, '../src/data/blogPosts.js');
const blogContent = fs.readFileSync(blogFilePath, 'utf8');

// Simple regex parsing for blog post fields in JS file
const posts = [];
const postBlocks = blogContent.split(/\{\s*id:/g).slice(1);

postBlocks.forEach((block, index) => {
  const slugMatch = block.match(/slug:\s*['"]([^'"]+)['"]/);
  const titleMatch = block.match(/title:\s*['"]([^'"]+)['"]/);
  const dateMatch = block.match(/date:\s*['"]([^'"]+)['"]/);
  const excerptMatch = block.match(/excerpt:\s*['"]([^'"]+)['"]/);
  const categoryMatch = block.match(/category:\s*['"]([^'"]+)['"]/);

  if (slugMatch && titleMatch) {
    posts.push({
      id: index + 1,
      slug: slugMatch[1],
      title: titleMatch[1].replace(/\\'/g, "'"),
      date: dateMatch ? dateMatch[1] : new Date().toLocaleDateString(),
      excerpt: excerptMatch ? excerptMatch[1].replace(/\\'/g, "'") : '',
      category: categoryMatch ? categoryMatch[1] : 'Insights'
    });
  }
});

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>HomeVibes Insights | Toronto Real Estate &amp; Neighborhood Vibe Reports</title>
    <link>${domain}/insights</link>
    <description>Automated real estate market analysis, neighborhood vibe reports, and urban planning insights across the Greater Toronto Area.</description>
    <language>en-us</language>
    <atom:link href="${domain}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${domain}/insights/${post.slug}</link>
      <guid isPermaLink="true">${domain}/insights/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.category}</category>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`).join('')}
  </channel>
</rss>
`;

const rssPath = path.join(__dirname, '../public/rss.xml');
fs.writeFileSync(rssPath, rssXml);
console.log(`✅ RSS feed successfully generated with ${posts.length} posts at ${rssPath}`);
