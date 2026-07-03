const fs = require('fs'); 
const code = fs.readFileSync('src/data/neighborhoodsData.js', 'utf8'); 

const idMapping = { 
  'downtown-toronto': '077', 
  'the-annex': '095', 
  'liberty-village': '082', 
  'north-york-centre': '051', 
  'don-mills': '042', 
  'midtown-toronto': '104', 
  'etobicoke-centre': '014', 
  'scarborough-centre': '137', 
  'leslieville': '070', 
  'high-park': '087' 
}; 

let modified = code; 
for (const [key, geoId] of Object.entries(idMapping)) { 
  const searchStr = 'id: "' + key + '",'; 
  const replaceStr = searchStr + '\n    geojsonId: "' + geoId + '",'; 
  modified = modified.replace(searchStr, replaceStr); 
} 

fs.writeFileSync('src/data/neighborhoodsData.js', modified); 
console.log('Added geojsonIds.');
