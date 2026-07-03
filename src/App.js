import React, { useState, useMemo, useEffect } from 'react';
import { neighborhoodsData } from './data/neighborhoodsData';
import VibeQuiz from './components/VibeQuiz';
import MapWidget from './components/MapWidget';
import NeighborhoodDetails from './components/NeighborhoodDetails';
import FilterBar from './components/FilterBar';
import { LogoIcon } from './components/SvgIcons';
import './App.css';

export default function App() {
  const [view, setView] = useState('quiz'); // 'quiz' | 'results'
  const [userPreferences, setUserPreferences] = useState(null);
  const [filters, setFilters] = useState(null);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [cityFilter, setCityFilter] = useState('All');

  // Dynamic Matching Algorithm (Luxury Refined)
  const matchedNeighborhoods = useMemo(() => {
    if (!userPreferences || !filters) return [];

    const { profile, hub, commuteFrequency, transitMode, lifestyle } = userPreferences;
    const { tenure, maxPrice, beds, baths, parkingRequired, selectedTypes = ['Condo', 'House', 'Townhouse', 'Loft'] } = filters;

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
        // Commute time score to selected hub by car/transit
        const commuteTime = area.commutes[hub]?.[transitMode] || 60;

        if (commuteTime <= 15) commuteScore = 100;
        else if (commuteTime <= 30) commuteScore = 90;
        else if (commuteTime <= 45) commuteScore = 75;
        else if (commuteTime <= 60) commuteScore = 55;
        else commuteScore = 35;

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

      // 4. Budget & Tenure Alignment (20% weight)
      let budgetScore = 100;
      const areaPriceNum = tenure === 'rent' ? area.avgRentNum : area.avgBuyNum;

      if (maxPrice < areaPriceNum) {
        const diffPercent = (areaPriceNum - maxPrice) / areaPriceNum;
        if (diffPercent <= 0.1) budgetScore = 85;
        else if (diffPercent <= 0.25) budgetScore = 60;
        else if (diffPercent <= 0.4) budgetScore = 30;
        else budgetScore = 10;
      }

      // 5. Check if has any matching listings
      const hasMatchingListings = (area.listings || []).some(listing => 
        listing.tenure === tenure &&
        listing.priceNum <= maxPrice &&
        selectedTypes.includes(listing.type) &&
        listing.beds >= beds &&
        listing.baths >= baths &&
        (!parkingRequired || listing.parking)
      );

      // 6. Total Compatibility Score
      let rawScore = 
        (lifeStageScore * 0.25) + 
        (commuteScore * 0.25) + 
        (avgAmenitiesScore * 0.30) + 
        (budgetScore * 0.20);

      // Apply match score penalty if no properties in area fit specs
      if (!hasMatchingListings) {
        rawScore -= 15;
      }

      // Round and cap between 40% and 99%
      const finalScore = Math.min(99, Math.max(40, Math.round(rawScore)));

      return {
        ...area,
        matchScore: finalScore
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [userPreferences, filters]);

  // Handle Quiz Completion
  const handleQuizComplete = (prefs) => {
    setUserPreferences(prefs);
    setFilters({
      tenure: prefs.tenure,
      maxPrice: prefs.maxPrice,
      beds: prefs.beds,
      baths: prefs.baths,
      parkingRequired: prefs.parkingRequired,
      selectedTypes: prefs.selectedTypes
    });
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

  // Reset quiz state
  const handleRetakeQuiz = () => {
    setUserPreferences(null);
    setFilters(null);
    setSelectedArea(null);
    setCityFilter('All');
    setView('quiz');
  };

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <header className="app-header-nav luxury-header">
        <div className="logo-wrap" onClick={handleRetakeQuiz}>
          <span className="logo-icon gold-text"><LogoIcon size={32} /></span>
          <h1 className="logo-text display-font">
            HomeVibes <span className="logo-badge luxury-badge uppercase">GTA</span>
          </h1>
        </div>
        <p className="header-desc uppercase letter-spacing">Bespoke neighborhood profiles & luxury real estate matcher</p>
        {view === 'results' && (
          <button className="btn-header-action luxury-btn-header" onClick={handleRetakeQuiz}>
            Reset & Retake Quiz
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="app-main-content">
        {view === 'quiz' ? (
          <div className="quiz-view-wrapper">
            <div className="hero-section">
              <h2 className="hero-title display-font gold-text-glow">Discover Your Perfect GTA Neighborhood</h2>
              <p className="hero-subtitle">Evaluate your lifestage, commuting hubs, transit mode, and budget parameters to compute a custom compatibility match with premium locations.</p>
            </div>
            <VibeQuiz onComplete={handleQuizComplete} />
          </div>
        ) : (
          <div className="results-layout fade-in">
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
                      area.matchScore >= 90 ? '#D4AF37' : 
                      area.matchScore >= 75 ? '#C5A880' : 
                      area.matchScore >= 60 ? '#8E7557' : '#4A4B54';

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
                          <span className="gold-text">Class: {area.priceBracket}</span>
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
            <div className="results-map-column">
              <FilterBar filters={filters} onChange={setFilters} />
              <div className="map-wrapper">
                <MapWidget 
                  neighborhoods={filteredAreas}
                  selectedNeighborhood={selectedArea}
                  onSelectNeighborhood={(area) => setSelectedArea(area)}
                />
              </div>
            </div>

            {/* Right Column: Details Panel */}
            <div className="results-details-column">
              <NeighborhoodDetails
                selectedArea={selectedArea || filteredAreas[0]}
                userPreferences={userPreferences}
                filters={filters}
                isPremiumUnlocked={isPremiumUnlocked}
                setIsPremiumUnlocked={setIsPremiumUnlocked}
                onClose={() => setSelectedArea(null)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer luxury-footer">
        <p>&copy; {new Date().getFullYear()} HomeVibes GTA. All data simulated for prototype demonstration. All deep-links connect to live realtor platforms.</p>
      </footer>
    </div>
  );
}
