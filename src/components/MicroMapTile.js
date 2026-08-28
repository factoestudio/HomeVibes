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

export default function MicroMapTile({ post }) {
  const lat = post?.coordinates?.lat || 43.6532;
  const lng = post?.coordinates?.lng || -79.3832;
  const zoom = 13;

  const tile = latLngToTile(lat, lng, zoom);
  
  // Use Esri Dark Gray canvas tiles for a sleek, dark-mode architectural look
  const tileUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/${tile.z}/${tile.y}/${tile.x}`;
  const fallbackUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${tile.z}/${tile.y}/${tile.x}`;

  const areaName = post?.neighborhoodName ? post.neighborhoodName.split('&')[0].trim() : (post?.city || 'GTA');
  const cityTag = post?.city || 'Toronto';

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '200px', 
        position: 'relative', 
        overflow: 'hidden',
        backgroundColor: '#0a0a16',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Background Dark Map Tile */}
      <img
        src={tileUrl}
        alt={`${areaName} map`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.85) contrast(1.15) saturate(0.6)',
          transform: 'scale(1.08)',
          display: 'block'
        }}
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackUrl;
        }}
      />

      {/* Subtle Dark Vignette & Grid Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(13, 12, 46, 0.15) 0%, rgba(10, 10, 24, 0.75) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Subtle Coordinate Grid Lines */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none'
        }}
      />

      {/* Top Left: GPS Coordinates Badge */}
      <div 
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: 'rgba(13, 12, 46, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: 'rgba(255, 255, 255, 0.85)',
          fontSize: '0.72rem',
          fontFamily: 'monospace',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}
      >
        <span style={{ color: '#C084FC', fontSize: '0.8rem' }}>📍</span>
        <span>{formatCoords(lat, lng)}</span>
      </div>

      {/* Top Right: Micro-Cluster / Region Tag */}
      <div 
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: 'rgba(13, 12, 46, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(208, 141, 246, 0.25)',
          color: '#E9D5FF',
          fontSize: '0.72rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          zIndex: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}
      >
        {cityTag}
      </div>

      {/* Center: Pulsing Radar Location Beacon */}
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
        {/* Pulsing Beacon Animation */}
        <div style={{ position: 'relative', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'rgba(208, 141, 246, 0.4)',
              animation: 'pulse 2s infinite ease-out'
            }} 
          />
          <div 
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
              border: '2px solid #ffffff',
              boxShadow: '0 0 14px rgba(236, 72, 153, 0.9)'
            }} 
          />
        </div>
        
        {/* Neighborhood Name Mini Label Under Beacon */}
        <span 
          style={{
            marginTop: '4px',
            fontSize: '0.7rem',
            fontWeight: '600',
            color: '#ffffff',
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.9), 0 0 10px rgba(168, 85, 247, 0.5)',
            background: 'rgba(10, 10, 24, 0.65)',
            padding: '2px 8px',
            borderRadius: '10px',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            whiteSpace: 'nowrap',
            maxWidth: '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {areaName}
        </span>
      </div>

      {/* Subtle Corner Architectural Crosshairs */}
      <div style={{ position: 'absolute', bottom: '8px', left: '12px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', zIndex: 2 }}>
        [GEO-LOC: {tile.z}/{tile.x}/{tile.y}]
      </div>
      <div style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', zIndex: 2 }}>
        + 2026 AUDIT +
      </div>
    </div>
  );
}
