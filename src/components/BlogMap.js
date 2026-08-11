import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function BlogMap({ location, neighborhoodName, city, onExplore }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const lat = location?.lat || 43.6532;
  const lng = location?.lng || -79.3832;

  useEffect(() => {
    if (!mapRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map
    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // CARTO Dark Matter Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Custom Glowing Purple Marker Icon
    const customIcon = L.divIcon({
      className: 'blog-map-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle, #D08DF6 0%, #B05EF1 70%, #7B2CBF 100%);
          border: 3px solid #ffffff;
          box-shadow: 0 0 20px rgba(208, 141, 246, 0.8), 0 4px 12px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          cursor: pointer;
          animation: pulse-glow 2s infinite ease-in-out;
        ">
          📍
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

    const tooltipContent = `
      <div style="
        font-family: 'Plus Jakarta Sans', sans-serif;
        padding: 6px 10px;
        color: #1d1d1f;
      ">
        <strong style="font-family: 'Outfit', sans-serif; font-size: 1rem; color: #7B2CBF;">
          ${neighborhoodName || 'Featured Enclave'}
        </strong>
        ${city ? `<div style="font-size: 0.8rem; color: #6e6e73; margin-top: 2px;">📍 ${city}, ON</div>` : ''}
      </div>
    `;

    marker.bindTooltip(tooltipContent, {
      permanent: true,
      direction: 'top',
      offset: [0, -12],
      opacity: 0.95
    });

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, neighborhoodName, city]);

  return (
    <div className="blog-map-card" style={{
      marginTop: '2.5rem',
      marginBottom: '2.5rem',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid rgba(208, 141, 246, 0.3)',
      boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
      background: 'var(--color-bg-dark, #1a1528)'
    }}>
      <div style={{
        padding: '1rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(208,141,246,0.15) 0%, rgba(123,44,191,0.25) 100%)',
        borderBottom: '1px solid rgba(208, 141, 246, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.3rem' }}>🗺️</span>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent, #D08DF6)', fontWeight: 600 }}>
              Location & Boundaries
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#ffffff' }}>
              {neighborhoodName} {city ? `(${city})` : ''}
            </div>
          </div>
        </div>

        {onExplore && (
          <button
            onClick={onExplore}
            className="btn-luxury"
            style={{
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            Explore Area Data &rarr;
          </button>
        )}
      </div>

      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '320px',
          zIndex: 1
        }}
      />
    </div>
  );
}
