import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import torontoGeoJSON from '../data/toronto.json';

// Helper to determine marker color based on match percentage - Slate Platinum Palette
const getMarkerColor = (score) => {
  if (score >= 90) return '#E6EBF2'; // Bright Platinum
  if (score >= 75) return '#B0C4DE'; // Light Steel Blue
  if (score >= 60) return '#778899'; // Light Slate Gray
  return '#4A5568'; // Muted Slate
};

// Helper to generate mathematical Bezier curves (flight paths)
const generateBezierPoints = (startLat, startLng, endLat, endLng) => {
  const points = [];
  const numPoints = 60; // Higher = smoother curve
  
  const midLat = (startLat + endLat) / 2;
  const midLng = (startLng + endLng) / 2;
  
  const dx = endLng - startLng;
  const dy = endLat - startLat;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Normal vector
  const normalX = -dy / dist;
  const normalY = dx / dist;
  
  // Curve height
  const curveHeight = dist * 0.25; 
  
  const ctrlLat = midLat + normalY * curveHeight;
  const ctrlLng = midLng + normalX * curveHeight;
  
  for (let t = 0; t <= 1; t += 1/numPoints) {
    const lat = (1 - t) * (1 - t) * startLat + 2 * (1 - t) * t * ctrlLat + t * t * endLat;
    const lng = (1 - t) * (1 - t) * startLng + 2 * (1 - t) * t * ctrlLng + t * t * endLng;
    points.push([lat, lng]);
  }
  return points;
};

const buildOverpassQuery = (profile, lat, lng) => {
  const radius = 1200; // 1200 meters search radius
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

const getIconForTag = (tags) => {
  if (tags.amenity === 'cafe') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`;
  if (tags.amenity === 'library') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>`;
  if (tags.amenity === 'fast_food' || tags.amenity === 'restaurant') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`;
  if (tags.amenity === 'pub' || tags.amenity === 'bar') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 22h8"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5V2H7v8a5 5 0 0 0 5 5Z"/></svg>`;
  if (tags.leisure === 'fitness_centre') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.65 21.35a2 2 0 0 1-2.83 0l-5.66-5.66a2 2 0 0 1 0-2.83l2.83-2.83a2 2 0 0 1 2.83 0l5.66 5.66a2 2 0 0 1 0 2.83Z"/><path d="M2.65 5.35a2 2 0 0 1 2.83 0l5.66 5.66a2 2 0 0 1 0 2.83l-2.83 2.83a2 2 0 0 1-2.83 0L2.65 8.18a2 2 0 0 1 0-2.83Z"/></svg>`;
  if (tags.leisure === 'park') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-8"/><path d="m20 10-2-2 2-2-2-2-2 2-2-2-2 2-2-2-2 2-2 2 2 2-2 2 2 2-2 2 2 2Z"/></svg>`;
  if (tags.shop === 'supermarket' || tags.shop === 'bakery') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`;
  if (tags.amenity === 'school' || tags.amenity === 'childcare') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>`;
  if (tags.amenity === 'hospital' || tags.amenity === 'clinic') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6v4"/><path d="M14 8h-4"/><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>`;
  
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
};

export default function MapWidget({ neighborhoods, selectedNeighborhood, onSelectNeighborhood, userPreferences }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
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

    // 2. Add Neighborhood Polygons
    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    if (neighborhoods && neighborhoods.length > 0) {
      geoJsonLayerRef.current = L.geoJSON(torontoGeoJSON, {
        style: function (feature) {
          const areaId = feature.properties.AREA_S_CD;
          const matchedNeighborhood = neighborhoods.find(n => n.geojsonId === areaId);
          
          if (matchedNeighborhood) {
            const matchScore = matchedNeighborhood.matchScore || 0;
            const color = getMarkerColor(matchScore);
            return {
              color: color,
              weight: 2,
              opacity: 0.8,
              fillColor: color,
              fillOpacity: 0.35,
              className: `polygon-pulse-${matchedNeighborhood.id}`
            };
          } else {
            return {
              color: 'transparent',
              weight: 0,
              fillOpacity: 0
            };
          }
        },
        onEachFeature: function (feature, layer) {
          const areaId = feature.properties.AREA_S_CD;
          const matchedNeighborhood = neighborhoods.find(n => n.geojsonId === areaId);
          
          if (matchedNeighborhood) {
            const matchScore = matchedNeighborhood.matchScore || 0;
            const color = getMarkerColor(matchScore);
            layer.bindTooltip(
              `<div class="map-tooltip luxury-tooltip">
                <strong style="color: var(--text-main); font-family: 'Outfit', sans-serif;">${matchedNeighborhood.name}</strong>
                <div style="color: ${color}; font-weight: bold; margin-top: 3px; font-family: 'Plus Jakarta Sans', sans-serif;">
                  ${matchScore}% Match
                </div>
              </div>`,
              { direction: 'center', opacity: 0.95 }
            );
            
            layer.on('click', () => {
              if (onSelectNeighborhood) onSelectNeighborhood(matchedNeighborhood);
            });
          }
        }
      }).addTo(map);
    }
  }, [neighborhoods, onSelectNeighborhood]);

  // Pan to selected neighborhood and commute locations
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedNeighborhood) return;

    const { lat, lng } = selectedNeighborhood;
    
    // Fit bounds if we have commute locations
    if (userPreferences?.commuteLocations?.length > 0) {
      const bounds = L.latLngBounds([[lat, lng]]);
      userPreferences.commuteLocations.forEach(loc => {
        if (loc.lat && loc.lng) {
          bounds.extend([loc.lat, loc.lng]);
        }
      });
      map.fitBounds(bounds, {
        padding: [60, 60],
        animate: true,
        duration: 1.5
      });
    } else {
      map.setView([lat, lng], 13, {
        animate: true,
        duration: 1.5
      });
    }

    const activeMarker = markersRef.current[selectedNeighborhood.id];
    if (activeMarker) {
      activeMarker.openTooltip();
    }
  }, [selectedNeighborhood, userPreferences]);

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
          html: `<div style="background: var(--color-primary); color: var(--bg-dark); border-radius: 50%; padding: 4px; box-shadow: 0 0 10px rgba(212, 175, 55, 0.8); border: 2px solid var(--text-main); display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: commuteIcon }).addTo(map);
        marker.bindTooltip(`<div class="luxury-tooltip" style="color: #ffffff; font-family:'Outfit', sans-serif;"><strong>Your Commute:</strong><br/>${loc.address}</div>`, { direction: 'top', offset: [0, -10], opacity: 0.95 });
        extraMarkersRef.current[`commute-${idx}`] = marker;

        // Draw flight path curve if a neighborhood is selected
        if (selectedNeighborhood && selectedNeighborhood.lat && selectedNeighborhood.lng) {
          const bezierPoints = generateBezierPoints(selectedNeighborhood.lat, selectedNeighborhood.lng, loc.lat, loc.lng);
          const flightPath = L.polyline(bezierPoints, {
            color: '#B05EF1', // Vibrant Purple
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 15',
            className: 'flight-path-line'
          }).addTo(map);
          extraMarkersRef.current[`commute-path-${idx}`] = flightPath;
        }
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
              const svgIcon = getIconForTag(poi.tags || {});
              const name = poi.tags?.name || 'Local Vibe';
              
              const poiIcon = L.divIcon({
                className: 'custom-poi-marker',
                html: `<div style="background: rgba(212, 175, 55, 0.15); color: var(--color-primary); backdrop-filter: blur(4px); border-radius: 50%; border: 1px solid rgba(212, 175, 55, 0.4); display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; font-size: 14px;">${svgIcon}</div>`,
                iconSize: [26, 26],
                iconAnchor: [13, 13]
              });

              const marker = L.marker([poi.lat, poi.lon], { icon: poiIcon }).addTo(map);
              marker.bindTooltip(`<div class="luxury-tooltip" style="color: #ffffff; font-family:'Outfit', sans-serif;"><strong>${name}</strong></div>`, { direction: 'top', offset: [0, -10], opacity: 0.95 });
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
            <span>Matching home with your vibes...</span>
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

