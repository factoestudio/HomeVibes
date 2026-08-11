const fs = require('fs');
const path = require('path');

const blogFilePath = path.join(__dirname, '../src/data/blogPosts.js');
let content = fs.readFileSync(blogFilePath, 'utf8');

const metadataMap = {
  18: { lat: 43.4443, lng: -79.6703, name: "Downtown Oakville & Kerr Village", city: "Oakville", nid: "oakville" },
  17: { lat: 43.6465, lng: -79.4637, name: "Roncesvalles & High Park", city: "Toronto", nid: "roncesvalles" },
  16: { lat: 43.6710, lng: -79.2941, name: "The Beaches & Upper Beaches", city: "Toronto", nid: "the-beaches" },
  15: { lat: 43.6625, lng: -79.3364, name: "Leslieville & South Riverdale", city: "Toronto", nid: "leslieville" },
  14: { lat: 43.5516, lng: -79.5855, name: "Port Credit & Mississauga Waterfront", city: "Mississauga", nid: "port-credit" },
  13: { lat: 43.8703, lng: -79.3101, name: "Unionville & Main St Markham", city: "Markham", nid: "markham" },
  12: { lat: 43.6702, lng: -79.3898, name: "Yorkville & The Annex", city: "Toronto", nid: "yorkville" },
  11: { lat: 43.7946, lng: -79.5268, name: "Vaughan Metropolitan Centre", city: "Vaughan", nid: "vaughan" },
  10: { lat: 43.6853, lng: -79.7599, name: "Downtown Brampton & Mount Pleasant", city: "Brampton", nid: "brampton" },
  9: { lat: 43.8105, lng: -79.0888, name: "Pickering Waterfront & Nautical Village", city: "Pickering", nid: "pickering" },
  8: { lat: 43.6372, lng: -79.4181, name: "Liberty Village & King West", city: "Toronto", nid: "liberty-village" },
  7: { lat: 43.7065, lng: -79.3986, name: "Yonge & Eglinton Midtown Hub", city: "Toronto", nid: "midtown-toronto" },
  6: { lat: 43.8762, lng: -79.4372, name: "Richmond Hill Heritage Core", city: "Richmond Hill", nid: "richmond-hill" },
  5: { lat: 43.5828, lng: -79.7145, name: "Streetsville Village", city: "Mississauga", nid: "mississauga-valleys" },
  4: { lat: 43.6501, lng: -79.4751, name: "Bloor West Village & High Park", city: "Toronto", nid: "roncesvalles" },
  3: { lat: 43.6521, lng: -79.3551, name: "Canary District & Waterfront East", city: "Toronto", nid: "downtown-toronto" },
  2: { lat: 43.3255, lng: -79.7990, name: "Burlington Waterfront & Downtown", city: "Burlington", nid: "oakville" },
  1: { lat: 43.6532, lng: -79.3832, name: "Greater Toronto Area Overview", city: "GTA Regional", nid: "downtown-toronto" }
};

// Add coordinates, neighborhoodName, city, and neighborhoodId to each post object
for (const [idStr, meta] of Object.entries(metadataMap)) {
  const id = parseInt(idStr, 10);
  const targetPattern = new RegExp(`(id:\\s*${id},\\n\\s*slug:.*?\\n\\s*title:.*?\\n\\s*date:.*?\\n\\s*excerpt:.*?\\n\\s*category:.*?,)`, 's');
  
  if (targetPattern.test(content)) {
    const replacement = `$1\n    coordinates: { lat: ${meta.lat}, lng: ${meta.lng} },\n    neighborhoodName: ${JSON.stringify(meta.name)},\n    city: ${JSON.stringify(meta.city)},\n    neighborhoodId: ${JSON.stringify(meta.nid)},`;
    content = content.replace(targetPattern, replacement);
  }
}

fs.writeFileSync(blogFilePath, content, 'utf8');
console.log('Successfully updated blogPosts.js with neighborhood map metadata for all 18 posts!');
