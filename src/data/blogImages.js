// Curated, verified, copyright-free high-resolution urban & neighborhood photography
const URBAN_NEIGHBORHOOD_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', // Modern Urban Condo Highrise
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80', // Tree-Lined Residential Street & Houses
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', // Downtown Glass Architecture
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', // Modern Residential Townhome
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80', // Contemporary Neighborhood Home
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', // Residential Community Streetscape
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80', // City Street & Skyline Architecture
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', // Urban Brick Loft Building
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80', // Neighborhood Storefronts & Street
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', // Cozy Urban Cafe Patio
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80', // Modern Apartment Complex
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', // Modern Urban Facade
];

export const getBlogImage = (post) => {
  if (!post) return URBAN_NEIGHBORHOOD_IMAGES[0];
  const id = Number(post.id) || 1;
  const index = Math.abs(id - 1) % URBAN_NEIGHBORHOOD_IMAGES.length;
  return URBAN_NEIGHBORHOOD_IMAGES[index];
};
