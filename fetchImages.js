const fs = require('fs');

async function main() {
  let content = fs.readFileSync('src/data/blogPosts.js', 'utf8');
  
  // Find all posts
  const regex = /title:\s*'([^']*)'[\s\S]*?neighborhoodName:\s*"([^"]*)"/g;
  let match;
  
  const replacements = [];
  
  while ((match = regex.exec(content)) !== null) {
    const title = match[1];
    const neighborhood = match[2];
    
    // Fetch wikipedia image
    const search = neighborhood.split('&')[0].trim() + ' Toronto';
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=800&titles=${encodeURIComponent(search)}&format=json`;
    
    try {
      const res = await fetch(wikiUrl);
      const data = await res.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      let imageUrl = null;
      if (pageId !== '-1' && pages[pageId].thumbnail) {
        imageUrl = pages[pageId].thumbnail.source;
      }
      
      if (!imageUrl) {
         // Fallback 1: try just the neighborhood name
         const search2 = neighborhood.split('&')[0].trim();
         const wikiUrl2 = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=800&titles=${encodeURIComponent(search2)}&format=json`;
         const res2 = await fetch(wikiUrl2);
         const data2 = await res2.json();
         const pages2 = data2.query.pages;
         const pageId2 = Object.keys(pages2)[0];
         if (pageId2 !== '-1' && pages2[pageId2].thumbnail) {
           imageUrl = pages2[pageId2].thumbnail.source;
         }
      }
      
      if (!imageUrl) {
        imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Toronto_Skyline_Summer_2020.jpg/800px-Toronto_Skyline_Summer_2020.jpg';
      }
      
      replacements.push({
        title,
        neighborhood,
        imageUrl
      });
      console.log('Found:', neighborhood, '->', imageUrl);
    } catch (e) {
      console.error(e);
    }
  }
  
  for (const r of replacements) {
    const escapedTitle = r.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(`(title:\\s*'${escapedTitle}',\\s*\\n\\s*date:)`, 'g');
    content = content.replace(searchRegex, `image: '${r.imageUrl}',\n    $1`);
  }
  
  fs.writeFileSync('src/data/blogPosts.js', content);
}

main();
