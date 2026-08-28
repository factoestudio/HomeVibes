// Curated, verified, copyright-free high-resolution photography for GTA Ontario micro-markets
export const GTA_BLOG_IMAGES = {
  31: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80', // Hazel McCallion LRT / Hurontario Transit Corridor
  30: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80', // Unionville & Erin Mills Family Homes & Tree-Lined Streets
  29: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', // Port Credit vs Downtown Oakville Waterfront Luxury
  28: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', // Dupont West Railpath Lofts & Industrial Arts District
  27: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', // GTA Resale Condos vs Suburban Townhomes
  26: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80', // Ontario Line Subway & Rapid Transit Corridor
  25: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80', // Hidden GTA Remote Worker Enclaves (Suburban Greenery)
  24: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', // Leslieville vs The Junction West-East Showdown
  23: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', // Downtown Oakville & Kerr Village Waterfront Luxury
  22: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80', // Unionville & Markham Centre Modern Infrastructure
  21: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', // Port Credit Waterfront Lakeside Village
  20: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', // Etobicoke Centre & Six Points Master-Planned Civic Hub
  19: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80', // The Junction & Dupont West Artisan Coffee & Culture
  18: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', // Downtown Oakville Waterfront & Harbour Vibe
  17: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80', // Roncesvalles & High Park Green Canopy & Nature
  16: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', // The Beaches & Upper Beaches Lake Ontario Coastal Village
  15: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', // Leslieville & South Riverdale Creative Design Enclave
  14: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', // Port Credit & Mississauga Waterfront Promenade
  13: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80', // Unionville Main Street Markham Heritage
  12: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', // Yorkville & Annex Tech Workers & Hybrid Architecture
  11: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', // Vaughan Metropolitan Centre (VMC) Modern Glass Hub
  10: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', // Midtown Yonge & Eglinton Tech Hub & Highrises
  9:  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', // The Waterfront & Sugar Beach Urban Resort Living
  8:  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', // Liberty Village & King West Brick Loft Living
  7:  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', // Bank of Canada Rate Hold & Financial Architecture
  6:  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80', // Toronto Rental Reset & Richmond Hill Heritage
  5:  'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&q=80', // Eglinton Crosstown Line 5 Rapid Transit Launch
  4:  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', // 2026 Condo Shakeup & Move-In Ready Highrises
  3:  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80', // Leslieville & Ontario Line East Transit
  2:  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80', // Ossington Strip vs West Queen West Dining & Arts
  1:  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'  // Hazel McCallion Line Effect & Port Credit Transit
};

export const getBlogImage = (post) => {
  if (!post) return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80';
  if (post.image) return post.image;
  if (post.id && GTA_BLOG_IMAGES[post.id]) return GTA_BLOG_IMAGES[post.id];
  return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80';
};
