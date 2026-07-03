import React, { useState, useMemo, useEffect } from 'react';
import { neighborhoodsData } from './data/neighborhoodsData';
import VibeQuiz from './components/VibeQuiz';
import MapWidget from './components/MapWidget';
import NeighborhoodDetails from './components/NeighborhoodDetails';
import ThemeSelector from './components/ThemeSelector';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import ContactB2B from './components/ContactB2B';
import logoWhite from './assets/logo-white.png';
import logoPurple from './assets/logo-purple.png';
import './App.css';

// Haversine formula to calculate distance between two lat/lng coordinates in km
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; 
};

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('homevibes-theme') || 'auto');
  const [view, setView] = useState('quiz'); // 'quiz' | 'results'
  const [userPreferences, setUserPreferences] = useState(null);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [cityFilter, setCityFilter] = useState('All');

  // Apply theme class
  useEffect(() => {
    const applyTheme = (mode) => {
      if (mode === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    };

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');
      
      const listener = (e) => applyTheme(e.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', listener);
      localStorage.setItem('homevibes-theme', 'auto');
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme);
      localStorage.setItem('homevibes-theme', theme);
    }
  }, [theme]);

  // Dynamic Matching Algorithm (Luxury Refined)
  const matchedNeighborhoods = useMemo(() => {
    if (!userPreferences) return [];

    const { profile, commuteLocations, commuteFrequency, transitMode, lifestyle } = userPreferences;

    return neighborhoodsData.map(area => {
      // 1. Life Stage Suitability Match (25% weight)
      const suitabilityProp = `${profile}_suitability`;
      const suitabilityScore = area[suitabilityProp] || 5;
      const lifeStageScore = suitabilityScore * 10; // convert to 0-100 scale

      // 2. Commute & Transit Match (25% weight)
      let commuteScore = 50;

      if (commuteFrequency === 'remote') {
        // Remote workers get full score adjusted slightly by walkability
        commuteScore = 80 + (area.transit.walkability * 2);
      } else if (transitMode === 'walking') {
        // Walking preference prioritizes local walkability index
        commuteScore = area.transit.walkability * 10;
      } else {
        // Dynamic Haversine commute calculation
        if (commuteLocations && commuteLocations.length > 0) {
          let totalMins = 0;
          let validLocations = 0;

          commuteLocations.forEach(loc => {
            if (loc.lat && loc.lng && area.lat && area.lng) {
              validLocations++;
              const distKm = getDistanceFromLatLonInKm(loc.lat, loc.lng, area.lat, area.lng);
              
              // Apply simple speed estimation (city traffic vs transit)
              // Driving: ~30km/h (2 mins per km) + 5 min overhead
              // Transit: ~15km/h (4 mins per km) + 10 min overhead
              let estTime = 60;
              if (transitMode === 'driving') estTime = (distKm * 2.5) + 5;
              if (transitMode === 'transit') estTime = (distKm * 4.5) + 10;
              
              totalMins += estTime;
            }
          });

          if (validLocations > 0) {
            const avgTime = totalMins / validLocations;
            if (avgTime <= 15) commuteScore = 100;
            else if (avgTime <= 30) commuteScore = 90;
            else if (avgTime <= 45) commuteScore = 75;
            else if (avgTime <= 60) commuteScore = 55;
            else commuteScore = 35;
          } else {
            // Fallback if geocoding failed
            commuteScore = area.transit.walkability * 8; 
          }
        } else {
          commuteScore = area.transit.walkability * 8;
        }

        // Adjust based on frequency
        if (commuteFrequency === 'occasional') {
          commuteScore = (commuteScore * 0.6) + ((area.transit.walkability * 10) * 0.4);
        }
      }

      // 3. Expanded Amenities Match (30% weight)
      let amenitiesScoreSum = 0;
      const amenityKeys = Object.keys(lifestyle);

      amenityKeys.forEach(key => {
        const priorityVal = lifestyle[key]; // 0 = Not important, 1 = Nice, 2 = Must
        const areaVal = area.amenities[key] || 5;

        if (priorityVal === 0) {
          amenitiesScoreSum += 100; // Not important gets full score (no penalty)
        } else if (priorityVal === 1) {
          // Nice to have
          if (areaVal >= 6) amenitiesScoreSum += 100;
          else if (areaVal >= 4) amenitiesScoreSum += 80;
          else amenitiesScoreSum += 45;
        } else {
          // Must have
          if (areaVal >= 8) amenitiesScoreSum += 100;
          else if (areaVal >= 6) amenitiesScoreSum += 70;
          else if (areaVal >= 4) amenitiesScoreSum += 35;
          else amenitiesScoreSum += 10;
        }
      });

      const avgAmenitiesScore = amenitiesScoreSum / amenityKeys.length;

      // 4. Total Compatibility Score
      let rawScore = 
        (lifeStageScore * 0.30) + 
        (commuteScore * 0.30) + 
        (avgAmenitiesScore * 0.40);

      // Round and cap between 40% and 99%
      const finalScore = Math.min(99, Math.max(40, Math.round(rawScore)));

      return {
        ...area,
        matchScore: finalScore
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [userPreferences]);

  const handleQuizComplete = (prefs) => {
    setUserPreferences(prefs);
    setView('results');
  };

  // Pre-select best match when view changes to results
  useEffect(() => {
    if (view === 'results' && matchedNeighborhoods.length > 0 && !selectedArea) {
      setSelectedArea(matchedNeighborhoods[0]);
    }
  }, [view, matchedNeighborhoods, selectedArea]);

  // Get distinct cities for filter tabs
  const cities = useMemo(() => {
    const list = new Set(neighborhoodsData.map(area => area.city.split(' ')[0])); // Get base city name e.g. "Toronto"
    return ['All', ...Array.from(list)];
  }, []);

  // Filtered Neighborhood List
  const filteredAreas = useMemo(() => {
    if (cityFilter === 'All') return matchedNeighborhoods;
    return matchedNeighborhoods.filter(area => area.city.startsWith(cityFilter));
  }, [matchedNeighborhoods, cityFilter]);

  const handleRetakeQuiz = () => {
    setUserPreferences(null);
    setSelectedArea(null);
    setCityFilter('All');
    setView('quiz');
  };

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <header className="app-header-nav luxury-header">
        <div className="logo-wrap" onClick={handleRetakeQuiz}>
          <img src={logoWhite} alt="HomeVibes" className="brand-logo logo-dark-mode" />
          <img src={logoPurple} alt="HomeVibes" className="brand-logo logo-light-mode" />
        </div>
        <p className="header-desc uppercase letter-spacing">Bespoke neighborhood profiles & luxury real estate matcher</p>
        <div className="header-right">
          <ThemeSelector theme={theme} setTheme={setTheme} />
          {view === 'results' && (
            <button className="btn-header-action luxury-btn-header" onClick={handleRetakeQuiz}>
              Reset & Retake Quiz
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-main-content">
        {view === 'quiz' ? (
          <div className="quiz-view-wrapper">
            <div className="hero-section">
              <h2 className="hero-title display-font platinum-text-glow">Discover Your Perfect GTA Neighborhood</h2>
              <p className="hero-subtitle">Evaluate your lifestage, commuting hubs, transit mode, and budget parameters to compute a custom compatibility match with premium locations.</p>
            </div>
            <VibeQuiz onComplete={handleQuizComplete} />
          </div>
          ) : view === 'privacy' ? (
            <PrivacyPolicy setView={setView} />
          ) : view === 'contact' ? (
            <ContactB2B setView={setView} />
          ) : (
            <div className="results-container animate-fade-in">
            {/* Left Column: List of Matches */}
            <div className="results-list-column">
              <div className="list-column-header">
                <h3 className="display-font">Neighborhood Matches</h3>
                <p className="list-subtitle">Sorted by computed lifestyle compatibility index</p>
              </div>

              {/* City Filters */}
              <div className="city-filters-scroll">
                {cities.map(city => (
                  <button
                    key={city}
                    className={`filter-tab luxury-filter-tab ${cityFilter === city ? 'active' : ''}`}
                    onClick={() => setCityFilter(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>

              {/* Matches List */}
              <div className="matches-list luxury-scroll">
                {filteredAreas.length > 0 ? (
                  filteredAreas.map(area => {
                    const isSelected = selectedArea?.id === area.id;
                    const scoreColor = 
                      area.matchScore >= 90 ? '#E6EBF2' : 
                      area.matchScore >= 75 ? '#B0C4DE' : 
                      area.matchScore >= 60 ? '#778899' : '#4A5568';

                    return (
                      <div
                        key={area.id}
                        className={`match-list-card luxury-match-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedArea(area)}
                      >
                        <div className="match-card-header">
                          <div className="match-card-title-wrap">
                            <span className="match-card-city uppercase">{area.city}</span>
                            <h4 className="match-card-name display-font">{area.name}</h4>
                          </div>
                          <span className="match-card-score display-font" style={{ color: scoreColor, borderColor: scoreColor }}>
                            {area.matchScore}%
                          </span>
                        </div>
                        <p className="match-card-desc">{area.description.substring(0, 100)}...</p>
                        <div className="match-card-meta">
                          <span className="platinum-text">Class: {area.priceBracket}</span>
                          <span>Walkability: {area.transit.walkability}/10</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-matches-msg card-subglass luxury-subcard">
                    No neighborhoods found matching this city filter. Try selecting 'All' or adjusting your quiz parameters.
                  </div>
                )}
              </div>
            </div>

            {/* Middle Column: Leaflet Map */}
            <div className="results-map-column" style={{ position: 'relative' }}>
              <div className="map-instruction-pulse fade-in">
                <span>Click a platinum Marker to View Analytics</span>
              </div>
                <MapWidget 
                  neighborhoods={filteredAreas}
                  selectedNeighborhood={selectedArea}
                  onSelectNeighborhood={(area) => setSelectedArea(area)}
                  userPreferences={userPreferences}
                />
            </div>

            {/* Right Column: Details Panel */}
            <div className="results-details-column">
              <NeighborhoodDetails
                selectedArea={selectedArea || filteredAreas[0]}
                userPreferences={userPreferences}
                isPremiumUnlocked={isPremiumUnlocked}
                setIsPremiumUnlocked={setIsPremiumUnlocked}
                onClose={() => setSelectedArea(null)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer setView={setView} />
    </div>
  );
}
