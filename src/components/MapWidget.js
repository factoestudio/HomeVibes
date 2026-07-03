import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Helper to determine marker color based on match percentage - Slate Platinum Palette
const getMarkerColor = (score) => {
  if (score >= 90) return '#E6EBF2'; // Bright Platinum
  if (score >= 75) return '#B0C4DE'; // Light Steel Blue
  if (score >= 60) return '#778899'; // Light Slate Gray
  return '#4A5568'; // Muted Slate
};

const buildOverpassQuery = (profile, lat, lng) => {
  const radius = 800; // 800 meters search radius
  let filters = '';
  switch(profile) {
    case 'student':
      filters = `
        node["amenity"="cafe"](around:${radius}, ${lat}, ${lng});
        node["amenity"="library"](around:${radius}, ${lat}, ${lng});
        node["amenity"="fast_food"](around:${radius}, ${lat}, ${lng});
        node["amenity"="pub"](around:${radius}, ${lat}, ${lng});
      `;
      break;
    case 'professional':
      filters = `
        node["amenity"="bar"](around:${radius}, ${lat}, ${lng});
        node["leisure"="fitness_centre"](around:${radius}, ${lat}, ${lng});
        node["amenity"="restaurant"](around:${radius}, ${lat}, ${lng});
        node["amenity"="cafe"](around:${radius}, ${lat}, ${lng});
      `;
      break;
    case 'family':
      filters = `
        node["leisure"="park"](around:${radius}, ${lat}, ${lng});
        node["shop"="supermarket"](around:${radius}, ${lat}, ${lng});
        node["amenity"="school"](around:${radius}, ${lat}, ${lng});
        node["amenity"="childcare"](around:${radius}, ${lat}, ${lng});
      `;
      break;
    case 'senior':
      filters = `
        node["amenity"="hospital"](around:${radius}, ${lat}, ${lng});
        node["amenity"="clinic"](around:${radius}, ${lat}, ${lng});
        node["leisure"="park"](around:${radius}, ${lat}, ${lng});
        node["shop"="bakery"](around:${radius}, ${lat}, ${lng});
      `;
      break;
    default:
      filters = `node["amenity"="cafe"](around:${radius}, ${lat}, ${lng});`;
  }
  return `[out:json][timeout:15];(${filters});out body 20;`; // Limit to 20 nodes for UI performance
};

const getEmojiForTag = (tags) => {
  if (tags.amenity === 'cafe') return '☕';
  if (tags.amenity === 'library') return '📚';
  if (tags.amenity === 'fast_food') return '🍕';
  if (tags.amenity === 'pub' || tags.amenity === 'bar') return '🍸';
  if (tags.leisure === 'fitness_centre') return '🏋️';
  if (tags.amenity === 'restaurant') return '🍽️';
  if (tags.leisure === 'park') return '🌳';
  if (tags.shop === 'supermarket') return '🛒';
  if (tags.amenity === 'school' || tags.amenity === 'childcare') return '🏫';
  if (tags.amenity === 'hospital' || tags.amenity === 'clinic') return '🏥';
  if (tags.shop === 'bakery') return '🍞';
  return '📍';
};

export default function MapWidget({ neighborhoods, selectedNeighborhood, onSelectNeighborhood, userPreferences }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const extraMarkersRef = useRef({});
  const [isLoadingPOIs, setIsLoadingPOIs] = useState(false);

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

    // Load CartoDB Light (Positron) and we will invert it in CSS for a high-contrast dark mode
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
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

  // Render Commute Locations and mock POIs
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing extra markers
    Object.values(extraMarkersRef.current).forEach(marker => marker.remove());
    extraMarkersRef.current = {};

    // 1. Commute Locations
    if (userPreferences?.commuteLocations?.length > 0) {
      userPreferences.commuteLocations.forEach((loc, idx) => {
        if (!loc.lat || !loc.lng) return;
        
        const commuteIcon = L.divIcon({
          className: 'custom-commute-marker',
          html: `<div style="background: #D4AF37; border-radius: 50%; padding: 4px; box-shadow: 0 0 10px rgba(212, 175, 55, 0.8); border: 2px solid #fff; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;"><span style="font-size: 16px;">📍</span></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: commuteIcon }).addTo(map);
        marker.bindTooltip(`<div class="luxury-tooltip" style="color:#fff; font-family:'Outfit', sans-serif;"><strong>Your Commute:</strong><br/>${loc.address}</div>`, { direction: 'top', offset: [0, -10], opacity: 0.95 });
        extraMarkersRef.current[`commute-${idx}`] = marker;
      });
    }

    // 2. Fetch OSM POIs (only when a neighborhood is selected)
    if (selectedNeighborhood && userPreferences?.profile) {
      const fetchPOIs = async () => {
        setIsLoadingPOIs(true);
        try {
          const query = buildOverpassQuery(userPreferences.profile, selectedNeighborhood.lat, selectedNeighborhood.lng);
          const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query
          });
          const data = await response.json();
          
          if (data && data.elements) {
            data.elements.forEach((poi, idx) => {
              if (!poi.lat || !poi.lon) return;
              const emoji = getEmojiForTag(poi.tags || {});
              const name = poi.tags?.name || 'Local Vibe';
              
              const poiIcon = L.divIcon({
                className: 'custom-poi-marker',
                html: `<div style="background: rgba(197, 168, 128, 0.15); backdrop-filter: blur(4px); border-radius: 50%; border: 1px solid rgba(197, 168, 128, 0.4); display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; font-size: 14px;">${emoji}</div>`,
                iconSize: [26, 26],
                iconAnchor: [13, 13]
              });

              const marker = L.marker([poi.lat, poi.lon], { icon: poiIcon }).addTo(map);
              marker.bindTooltip(`<div class="luxury-tooltip" style="color:#fff; font-family:'Outfit', sans-serif;"><strong>${name}</strong></div>`, { direction: 'top', offset: [0, -10], opacity: 0.95 });
              extraMarkersRef.current[`poi-${idx}`] = marker;
            });
          }
        } catch (error) {
          console.error("Failed to fetch OSM POIs:", error);
        } finally {
          setIsLoadingPOIs(false);
        }
      };

      fetchPOIs();
    }
  }, [selectedNeighborhood, userPreferences]);

  return (
    <div className="map-wrapper card-glass luxury-border" style={{ position: 'relative' }}>
      {isLoadingPOIs && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(7,8,11,0.5)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="map-instruction-pulse fade-in" style={{ position: 'relative', top: 0, margin: '0' }}>
            <span>Fetching Live OSM Data...</span>
          </div>
        </div>
      )}
      <div className="map-container" ref={mapContainerRef} style={{ height: '100%', width: '100%', borderRadius: '16px' }} />
      <div className="map-legend card-subglass luxury-subcard">
        <div className="legend-title display-font">Match compatibility</div>
        <div className="legend-items">
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#E6EBF2' }}></span> 90%+ (Bright Platinum)</div>
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#B0C4DE' }}></span> 75%-89% (Steel Blue)</div>
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#778899' }}></span> 60%-74% (Slate Gray)</div>
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#4A5568' }}></span> &lt; 60% (Muted)</div>
        </div>
      </div>
    </div>
  );
}
