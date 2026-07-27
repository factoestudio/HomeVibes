import { neighborhoodsData } from './neighborhoodsData';

export const comparisonPairsList = [
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

// Helper to parse pair slug into two neighborhood objects
export function getComparisonData(pairSlug) {
  if (!pairSlug) return null;
  const parts = pairSlug.split('-vs-');
  if (parts.length !== 2) return null;

  const slug1 = parts[0];
  const slug2 = parts[1];

  const area1 = neighborhoodsData.find(n => n.id === slug1 || n.id.includes(slug1) || slug1.includes(n.id)) || neighborhoodsData[0];
  const area2 = neighborhoodsData.find(n => n.id === slug2 || n.id.includes(slug2) || slug2.includes(n.id)) || neighborhoodsData[1];

  const title = `${area1.name} vs ${area2.name}: 2026 Toronto & GTA Neighborhood Vibe Showdown`;
  const description = `Detailed head-to-head comparison of ${area1.name} and ${area2.name} in 2026. Compare average rent, buying prices, walkability, top amenities, pros, cons, and lifestyle vibe fit.`;

  const faqs = [
    {
      question: `Which is better: ${area1.name} or ${area2.name}?`,
      answer: `${area1.name} (${area1.city}) offers a ${area1.tags.join(', ')} vibe with average rent around ${area1.avgRent}, whereas ${area2.name} (${area2.city}) delivers a ${area2.tags.join(', ')} lifestyle with average rent around ${area2.avgRent}. The right choice depends on your commute and lifestyle preferences.`
    },
    {
      question: `How do rent and buy prices compare between ${area1.name} and ${area2.name}?`,
      answer: `In ${area1.name}, average rent is ${area1.avgRent} and average purchase price is ${area1.avgBuy}. In comparison, ${area2.name} averages ${area2.avgRent} for rent and ${area2.avgBuy} for buying.`
    },
    {
      question: `Which neighborhood is more walkable: ${area1.name} or ${area2.name}?`,
      answer: `${area1.name} has a walkability rating of ${area1.transit?.walkability || 5}/10, while ${area2.name} features a rating of ${area2.transit?.walkability || 5}/10.`
    }
  ];

  return {
    pairSlug,
    area1,
    area2,
    title,
    description,
    faqs
  };
}
