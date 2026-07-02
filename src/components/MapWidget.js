import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Helper to determine marker color based on match percentage - Luxury Gold Palette
const getMarkerColor = (score) => {
  if (score >= 90) return '#D4AF37'; // Champagne Gold
  if (score >= 75) return '#C5A880'; // Satin Gold
  if (score >= 60) return '#8E7557'; // Muted Bronze
  return '#4A4B54'; // Charcoal Muted
};

export default function MapWidget({ neighborhoods, selectedNeighborhood, onSelectNeighborhood }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map instance centered on GTA
    const map = L.map(mapContainerRef.current, {
      center: [43.6532, -79.3832],
      zoom: 10,
      zoomControl: false,
      attributionControl: false
    });

    // Add attribution at bottom right
    L.control.attribution({ position: 'bottomright' }).addTo(map);

    // Zoom control at top right with luxury outlines
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Load CartoDB Dark Matter tiles (sleek dark mode)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Markers when neighborhoods data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    neighborhoods.forEach(n => {
      const matchScore = n.matchScore || 0;
      const color = getMarkerColor(matchScore);

      // Create a gorgeous custom glowing circle marker
      const marker = L.circleMarker([n.lat, n.lng], {
        radius: 11,
        fillColor: color,
        fillOpacity: 0.85,
        color: '#ffffff',
        weight: 1.5,
        className: `map-marker-pulse-${n.id}`
      }).addTo(map);

      // Add a popup tooltip showing name and match score
      marker.bindTooltip(
        `<div class="map-tooltip luxury-tooltip">
          <strong style="color: #fff; font-family: 'Outfit', sans-serif;">${n.name}</strong>
          <div style="color: ${color}; font-weight: bold; margin-top: 3px; font-family: 'Plus Jakarta Sans', sans-serif;">
            ${matchScore}% Match
          </div>
        </div>`,
        { direction: 'top', offset: [0, -10], opacity: 0.95, permanent: false }
      );

      // Handle marker click
      marker.on('click', () => {
        onSelectNeighborhood(n);
      });

      markersRef.current[n.id] = marker;
    });
  }, [neighborhoods, onSelectNeighborhood]);

  // Pan to selected neighborhood
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedNeighborhood) return;

    const { lat, lng } = selectedNeighborhood;
    map.setView([lat, lng], 12, {
      animate: true,
      duration: 1.5
    });

    const activeMarker = markersRef.current[selectedNeighborhood.id];
    if (activeMarker) {
      activeMarker.openTooltip();
    }
  }, [selectedNeighborhood]);

  return (
    <div className="map-wrapper card-glass luxury-border">
      <div className="map-container" ref={mapContainerRef} style={{ height: '100%', width: '100%', borderRadius: '16px' }} />
      <div className="map-legend card-subglass luxury-subcard">
        <div className="legend-title display-font">Match compatibility</div>
        <div className="legend-items">
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#D4AF37' }}></span> 90%+ (Champagne)</div>
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#C5A880' }}></span> 75%-89% (Satin Gold)</div>
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#8E7557' }}></span> 60%-74% (Bronze)</div>
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#4A4B54' }}></span> &lt; 60% (Muted)</div>
        </div>
      </div>
    </div>
  );
}
