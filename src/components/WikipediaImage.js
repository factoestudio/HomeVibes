import React, { useEffect, useState, useMemo } from 'react';

// Verified, high-quality, copyright-free architectural and lifestyle images for GTA topics
const CURATED_GTA_IMAGES = {
  family: [
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80', // Beautiful tree-lined suburban home
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80', // Modern family residence with yard
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', // Luxury family estate & lawn
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', // Contemporary suburban house
  ],
  transit: [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80', // Modern public transit LRT / bus
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80', // Urban transit & rapid transit tracks
    'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&q=80', // Modern commuter transit train
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', // City transit station architecture
  ],
  waterfront: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', // Lakeside beach & boardwalk
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', // Waterfront marina architecture
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', // Lake Ontario coastal vista
  ],
  condo: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', // Modern glass residential highrise
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', // Architectural downtown skyscraper
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80', // Luxury modern apartment building
  ],
  artisan: [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', // Boutique artisan cafe & storefront
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80', // Vibrant neighborhood streetscape
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', // Industrial loft brick & beam vibe
  ],
  parks: [
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80', // High Park lush green canopy
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80', // Park trail & community greenery
  ],
  finance: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', // Financial district towers
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80', // Urban business core
  ]
};

// Filter out non-scenic Wikipedia images like provincial flags, coats of arms, road signs, or SVG maps
const isBadImage = (url = '', pageTitle = '') => {
  const lower = `${url} ${pageTitle}`.toLowerCase();
  return (
    lower.includes('flag') ||
    lower.includes('coat_of_arms') ||
    lower.includes('map') ||
    lower.includes('logo') ||
    lower.includes('.svg') ||
    lower.includes('sign') ||
    lower.includes('seal') ||
    lower.includes('diagram') ||
    lower.includes('construction') ||
    lower.includes('plate') ||
    lower.includes('icon') ||
    lower.includes('census') ||
    pageTitle.toLowerCase() === 'ontario' ||
    pageTitle.toLowerCase() === 'canada'
  );
};

// Deterministically picks a contextual, high-res GTA image based on title/category keywords and post ID
function getContextualCuratedImage(category = '', title = '', neighborhood = '', id = 1) {
  const text = `${category} ${title} ${neighborhood}`.toLowerCase();
  
  let pool = CURATED_GTA_IMAGES.condo;
  if (text.includes('family') || text.includes('school') || text.includes('suburb') || text.includes('freehold') || text.includes('townhome')) {
    pool = CURATED_GTA_IMAGES.family;
  } else if (text.includes('transit') || text.includes('lrt') || text.includes('subway') || text.includes('line') || text.includes('hurontario') || text.includes('crosstown') || text.includes('ontario line') || text.includes('hazel')) {
    pool = CURATED_GTA_IMAGES.transit;
  } else if (text.includes('waterfront') || text.includes('port credit') || text.includes('oakville') || text.includes('beach') || text.includes('sugar beach') || text.includes('lake') || text.includes('lakeside')) {
    pool = CURATED_GTA_IMAGES.waterfront;
  } else if (text.includes('junction') || text.includes('leslieville') || text.includes('artisan') || text.includes('loft') || text.includes('ossington') || text.includes('queen') || text.includes('vibe') || text.includes('dupont')) {
    pool = CURATED_GTA_IMAGES.artisan;
  } else if (text.includes('park') || text.includes('high park') || text.includes('roncesvalles') || text.includes('green') || text.includes('eco')) {
    pool = CURATED_GTA_IMAGES.parks;
  } else if (text.includes('rate') || text.includes('rental') || text.includes('bank') || text.includes('finance') || text.includes('market') || text.includes('yield') || text.includes('pre-con')) {
    pool = CURATED_GTA_IMAGES.finance;
  }
  
  const index = Math.abs(Number(id) || 0) % pool.length;
  return pool[index];
}

const WikipediaImage = ({ id = 1, category = '', neighborhood = '', title = '' }) => {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  const curatedFallback = useMemo(() => {
    return getContextualCuratedImage(category, title, neighborhood, id);
  }, [category, title, neighborhood, id]);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      // 1. Identify if this is a general/overview market article, transit line audit, or comparison
      const text = `${title} ${neighborhood}`.toLowerCase();
      const isListicleOrTrend = 
        text.includes('top 5') || 
        text.includes('shakeup') || 
        text.includes('rate hold') || 
        text.includes('rental reset') || 
        text.includes('condo living dead') ||
        text.includes('lrt corridor') ||
        text.includes('hazel mccallion');

      if (isListicleOrTrend) {
        if (isMounted) {
          setImage(curatedFallback);
          setLoading(false);
        }
        return;
      }

      // 2. Clean neighborhood string for precise Wikipedia lookup
      let cleanQuery = neighborhood ? neighborhood.split('&')[0].split(',')[0].trim() : '';
      if (!cleanQuery && title) {
        cleanQuery = title.split(':')[0].split('vs')[0].trim();
      }

      if (!cleanQuery || cleanQuery.length < 3) {
        if (isMounted) {
          setImage(curatedFallback);
          setLoading(false);
        }
        return;
      }

      try {
        const queryTerm = `${cleanQuery} Toronto Ontario`;
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
            queryTerm
          )}&gsrlimit=2&prop=pageimages&pithumbsize=800&format=json&origin=*`
        );
        const data = await response.json();
        
        let thumb = null;
        if (data.query && data.query.pages) {
          const pages = Object.values(data.query.pages);
          for (const page of pages) {
            const src = page?.thumbnail?.source;
            const pageTitle = page?.title || '';
            if (src && !isBadImage(src, pageTitle)) {
              thumb = src;
              break;
            }
          }
        }

        if (isMounted) {
          if (thumb) {
            setImage(thumb);
          } else {
            setImage(curatedFallback);
          }
        }
      } catch (err) {
        if (isMounted) {
          setImage(curatedFallback);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [neighborhood, title, curatedFallback]);

  if (loading) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '220px', 
          backgroundColor: 'rgba(255,255,255,0.06)',
          animation: 'pulse 1.5s infinite ease-in-out'
        }} 
      />
    );
  }

  return (
    <img
      src={image || curatedFallback}
      alt={title}
      style={{ width: '100%', height: '220px', objectFit: 'cover' }}
      loading="lazy"
      onError={() => setImage(curatedFallback)}
    />
  );
};

export default WikipediaImage;
