import React, { useEffect, useState } from 'react';

const WikipediaImage = ({ neighborhood, title }) => {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
            neighborhood + ' Ontario'
          )}&gsrlimit=1&prop=pageimages&pithumbsize=800&format=json&origin=*`
        );
        const data = await response.json();
        
        let thumb = null;
        if (data.query && data.query.pages) {
          const pages = data.query.pages;
          const pageId = Object.keys(pages)[0];
          thumb = pages[pageId]?.thumbnail?.source;
        }
        
        if (thumb) {
          setImage(thumb);
        } else {
          setImage(`https://picsum.photos/seed/${encodeURIComponent(neighborhood)}/800/500`);
        }
      } catch (err) {
        setImage(`https://picsum.photos/seed/${encodeURIComponent(neighborhood)}/800/500`);
      }
      setLoading(false);
    };
    fetchData();
  }, [neighborhood]);

  if (loading) {
    return (
      <div style={{ width: '100%', height: '220px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
    );
  }

  return (
    <img
      src={image}
      alt={title}
      style={{ width: '100%', height: '220px', objectFit: 'cover' }}
    />
  );
};

export default WikipediaImage;
