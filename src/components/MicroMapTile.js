import React from 'react';

// Converts geographic coordinates (lat, lng) to slippy map tile indices at a given zoom level
function latLngToTile(lat = 43.6532, lng = -79.3832, zoom = 13) {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, zoom)
  );
  return { x, y, z: zoom };
}

// Formats decimal latitude / longitude into clean GPS coordinate notation
function formatCoords(lat, lng) {
  if (!lat || !lng) return '43.6532° N, 79.3832° W';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

// Tailors analytical PropTech & Vibe metrics to the specific article content
function getCardMetrics(post = {}) {
  const text = `${post.category || ''} ${post.title || ''} ${post.neighborhoodName || ''}`.toLowerCase();
  
  if (text.includes('family') || text.includes('school') || text.includes('freehold') || text.includes('unionville')) {
    return [
      { label: 'Schools', value: '9.4/10', color: '#10B981', icon: '🏫' },
      { label: 'Green Space', value: '96%', color: '#34D399', icon: '🌳' },
      { label: 'Family Vibe', value: '98%', color: '#60A5FA', icon: '👨‍👩‍👧' }
    ];
  } else if (text.includes('transit') || text.includes('lrt') || text.includes('subway') || text.includes('line') || text.includes('hurontario') || text.includes('crosstown') || text.includes('hazel')) {
    return [
      { label: 'Transit Score', value: '94%', color: '#EC4899', icon: '🚆' },
      { label: 'To Union', value: '24 min', color: '#F472B6', icon: '⚡' },
      { label: 'Growth Runway', value: 'High', color: '#A855F7', icon: '📈' }
    ];
  } else if (text.includes('waterfront') || text.includes('port credit') || text.includes('oakville') || text.includes('beach') || text.includes('lake')) {
    return [
      { label: 'Lakeside Index', value: '98%', color: '#06B6D4', icon: '⛵' },
      { label: 'Walk Score', value: '91%', color: '#38BDF8', icon: '🚶' },
      { label: 'Prestige Tier', value: 'AAA', color: '#F59E0B', icon: '✨' }
    ];
  } else if (text.includes('condo') || text.includes('rental') || text.includes('rate') || text.includes('yield') || text.includes('market') || text.includes('price')) {
    return [
      { label: 'Avg $/SqFt', value: '$780', color: '#A855F7', icon: '🏢' },
      { label: 'Rental Yield', value: '5.8%', color: '#10B981', icon: '📊' },
      { label: 'Demand Tier', value: 'Top 10%', color: '#EC4899', icon: '🔥' }
    ];
  } else {
    return [
      { label: 'Culture & Cafe', value: '96%', color: '#F59E0B', icon: '☕' },
      { label: 'Tech & Hybrid', value: '92%', color: '#818CF8', icon: '💻' },
      { label: 'Vibe Score', value: '95%', color: '#EC4899', icon: '🎯' }
    ];
  }
}

export default function MicroMapTile({ post }) {
  const lat = post?.coordinates?.lat || 43.6532;
  const lng = post?.coordinates?.lng || -79.3832;
  const zoom = 13;

  const tile = latLngToTile(lat, lng, zoom);
  
  // Esri Dark Gray vector street map
  const tileUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/${tile.z}/${tile.y}/${tile.x}`;
  const fallbackUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${tile.z}/${tile.y}/${tile.x}`;

  const areaName = post?.neighborhoodName ? post.neighborhoodName.split('&')[0].trim() : (post?.city || 'GTA Area');
  const cityTag = post?.city || 'Toronto';
  const metrics = getCardMetrics(post);

  return (
    <div 
      style={{ 
        width: '100%', 
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a18',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* 1. Upper Section: Dark Mode Geospatial Micro-Map */}
      <div 
        style={{ 
          width: '100%', 
          height: '145px', 
          position: 'relative', 
          overflow: 'hidden',
          backgroundColor: '#0a0a16'
        }}
      >
        {/* Background Street Grid */}
        <img
          src={tileUrl}
          alt={`${areaName} map`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.85) contrast(1.15) saturate(0.6)',
            transform: 'scale(1.06)',
            display: 'block'
          }}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackUrl;
          }}
        />

        {/* Subtle Vignette Overlay */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(13, 12, 46, 0.1) 0%, rgba(10, 10, 24, 0.7) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Top Left: GPS Coordinates Badge */}
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            padding: '3px 8px',
            borderRadius: '16px',
            background: 'rgba(13, 12, 46, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.68rem',
            fontFamily: 'monospace',
            letterSpacing: '0.4px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            zIndex: 2
          }}
        >
          <span style={{ color: '#C084FC', fontSize: '0.75rem' }}>📍</span>
          <span>{formatCoords(lat, lng)}</span>
        </div>

        {/* Top Right: Regional Badge */}
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '3px 8px',
            borderRadius: '16px',
            background: 'rgba(13, 12, 46, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(208, 141, 246, 0.3)',
            color: '#E9D5FF',
            fontSize: '0.68rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            zIndex: 2
          }}
        >
          {cityTag}
        </div>

        {/* Center: Pulsing Location Beacon */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 3,
            pointerEvents: 'none'
          }}
        >
          <div style={{ position: 'relative', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div 
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'rgba(208, 141, 246, 0.45)',
                animation: 'pulse 2s infinite ease-out'
              }} 
            />
            <div 
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
                border: '2px solid #ffffff',
                boxShadow: '0 0 12px rgba(236, 72, 153, 0.9)'
              }} 
            />
          </div>
          
          <span 
            style={{
              marginTop: '3px',
              fontSize: '0.68rem',
              fontWeight: '600',
              color: '#ffffff',
              background: 'rgba(10, 10, 24, 0.75)',
              padding: '2px 8px',
              borderRadius: '8px',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              whiteSpace: 'nowrap',
              maxWidth: '170px',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {areaName}
          </span>
        </div>
      </div>

      {/* 2. Lower Section: "Vibe Scorecard" Analytical Data Ribbon */}
      <div 
        style={{
          width: '100%',
          padding: '8px 12px',
          background: 'rgba(13, 12, 46, 0.92)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          boxSizing: 'border-box'
        }}
      >
        {metrics.map((m, idx) => (
          <div 
            key={idx} 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 6px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.75rem' }}>{m.icon}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: m.color, fontFamily: 'monospace' }}>
                {m.value}
              </span>
            </div>
            <span style={{ fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
