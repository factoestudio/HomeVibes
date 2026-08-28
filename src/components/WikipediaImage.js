import React, { useEffect, useState } from 'react';

const WikipediaImage = ({ neighborhood, title }) => {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=800&titles=${encodeURIComponent(
            neighborhood + ' Toronto'
          )}&format=json&origin=*`
        );
        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        
        const thumb = pages[pageId]?.thumbnail?.source;
        if (thumb) {
          setImage(thumb);
        } else {
          setImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Toronto_Skyline_Summer_2020.jpg/800px-Toronto_Skyline_Summer_2020.jpg');
        }
      } catch (err) {
        setImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Toronto_Skyline_Summer_2020.jpg/800px-Toronto_Skyline_Summer_2020.jpg');
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
