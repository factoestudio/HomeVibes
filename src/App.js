import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { neighborhoodsData } from './data/neighborhoodsData';
import VibeQuiz from './components/VibeQuiz';
import MapWidget from './components/MapWidget';
import NeighborhoodDetails from './components/NeighborhoodDetails';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import ContactB2B from './components/ContactB2B';
import LandingPage from './components/LandingPage';
import Blog from './components/Blog';
import AuthModal from './components/AuthModal';
import { supabase } from './supabaseClient';
import logoWhite from './assets/logo-white.png';
import logoPurple from './assets/logo-purple.png';
import './App.css';

// Haversine formula to calculate distance between two lat/lng coordinates in km
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Sigmoidal commute decay — smooth, psychologically accurate scoring
// Score drops gradually past target, not in harsh steps
const sigmoidCommuteScore = (estMinutes, targetMinutes = 30) => {
  const kappa = 0.12; // steepness of decay curve
  return 100 / (1 + Math.exp(kappa * (estMinutes - targetMinutes)));
};

// Cosine similarity between user preference vector and neighborhood feature vector
// Both vectors normalized to [0,1] before comparison
const cosineLifestyleSimilarity = (userWeights, areaAmenities, amenityKeys) => {
  let dot = 0, uMag = 0, nMag = 0;
  amenityKeys.forEach(key => {
    const u = (userWeights[key] ?? 0) / 2;          // normalize 0-2 → 0-1
    const n = (areaAmenities?.[key] ?? 5) / 10;       // normalize 0-10 → 0-1
    dot  += u * n;
    uMag += u * u;
    nMag += n * n;
  });
  const magnitude = Math.sqrt(uMag) * Math.sqrt(nMag);
  return magnitude > 0 ? (dot / magnitude) * 100 : 50;
};

// Auto-generate human-readable "Why this match?" bullets
const generateMatchExplanation = (area, userPreferences, subScores) => {
  const reasons = [];
  const lifestyle = userPreferences?.lifestyle || {};
  const transitMode = userPreferences?.transitMode || 'transit';
  const isRemote = userPreferences?.isRemote || false;

  // Commute
  if (isRemote) {
    reasons.push({ type: 'positive', text: 'Remote-work friendly — walkability prioritized over commute' });
  } else if (subScores.commute >= 80) {
    reasons.push({ type: 'positive', text: `Short ${transitMode} commute to your destination(s)` });
  } else if (subScores.commute < 45) {
    reasons.push({ type: 'warning', text: `Commute longer than ideal via ${transitMode}` });
  }

  // Amenity highlights
  if (lifestyle.cafes_restaurants > 0 && area.amenities?.cafes_restaurants >= 8)
    reasons.push({ type: 'positive', text: `Vibrant dining & café scene (${area.amenities.cafes_restaurants}/10)` });
  if (lifestyle.parks_nature > 0 && area.amenities?.parks_nature >= 7)
    reasons.push({ type: 'positive', text: `Excellent parks & green space access (${area.amenities.parks_nature}/10)` });
  if (lifestyle.dog_parks > 0 && area.amenities?.dog_parks >= 7)
    reasons.push({ type: 'positive', text: `Great dog parks & pet-friendly spaces (${area.amenities.dog_parks}/10)` });
  if (lifestyle.malls_shopping > 0 && area.amenities?.malls_shopping >= 7)
    reasons.push({ type: 'positive', text: `Strong retail & shopping corridor` });
  if (lifestyle.premium_groceries > 0 && area.amenities?.premium_groceries >= 7)
    reasons.push({ type: 'positive', text: `Organic & premium grocery access nearby` });
  if (lifestyle.libraries_civic > 0 && area.amenities?.libraries_civic >= 7)
    reasons.push({ type: 'positive', text: `Well-served community & civic amenities` });

  // Lifestyle mismatches
  if (lifestyle.parks_nature === 2 && (area.amenities?.parks_nature ?? 0) < 5)
    reasons.push({ type: 'warning', text: `Limited green space — parks are a must-have for you` });
  if (lifestyle.cafes_restaurants === 2 && (area.amenities?.cafes_restaurants ?? 0) < 5)
    reasons.push({ type: 'warning', text: `Below-average dining options for your food-focused lifestyle` });

  // Transit
  if (area.transit?.walkability >= 8)
    reasons.push({ type: 'positive', text: `Highly walkable — most errands done on foot (${area.transit.walkability}/10)` });

  // Budget
  if (userPreferences?.profile === 'student' && area.priceBracket === '$$$$')
    reasons.push({ type: 'warning', text: 'Luxury price bracket — above typical student budget' });

  return reasons.slice(0, 4); // cap at 4 bullets
};

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'quiz' | 'results' | 'privacy' | 'contact' | 'blog'
  const [activeBlogSlug, setActiveBlogSlug] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(true);
  const [selectedArea, setSelectedArea] = useState(null);
  const [cityFilter, setCityFilter] = useState('All');

  // Auth State
  const [session, setSession] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navigateTo = useCallback((path, push = true) => {
    if (push && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    const parts = path.split('/').filter(Boolean);
    if (parts[0] === 'insights' || parts[0] === 'blog') {
      setView('blog');
      setActiveBlogSlug(parts[1] || null);
    } else if (parts[0] === 'privacy') {
      setView('privacy');
    } else if (parts[0] === 'contact') {
      setView('contact');
    } else if (parts[0] === 'quiz') {
      setView('quiz');
    } else if (parts[0] === 'results') {
      setView('results');
    } else {
      if (userPreferences) setView('results');
      else setView('landing');
    }
    window.scrollTo(0, 0);
  }, [userPreferences]);

  // Synchronize state with URL location
  const handleLocationChange = useCallback(() => {
    const path = window.location.pathname;
    if (path === '/insights' || path === '/insights/' || path === '/blog' || path === '/blog/') {
      setView('blog');
      setActiveBlogSlug(null);
    } else if (path.startsWith('/insights/') || path.startsWith('/blog/')) {
      const parts = path.split('/').filter(Boolean);
      const slug = parts[1];
      setView('blog');
      setActiveBlogSlug(slug || null);
    } else if (path === '/privacy' || path === '/privacy/') {
      setView('privacy');
    } else if (path === '/contact' || path === '/contact/') {
      setView('contact');
    } else if (path === '/quiz' || path === '/quiz/') {
      setView('quiz');
    } else if (path === '/results' || path === '/results/') {
      if (!userPreferences) {
        navigateTo('/quiz');
        return;
      }
      setView('results');
    } else {
      if (userPreferences) {
        setView('results');
      } else {
        setView('landing');
      }
    }
  }, [userPreferences, navigateTo]);



  useEffect(() => {
    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [handleLocationChange]);

  // Initialize Auth & Fetch Preferences
  useEffect(() => {
    const fetchUserPreferences = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.warn('Could not fetch preferences:', error.message);
          return;
        }

        if (data && data.preferences) {
          setUserPreferences(data.preferences);
          setView('results');
        }
      } catch (err) {
        console.error('Error fetching preferences:', err);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserPreferences(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserPreferences(session.user.id);
      } else {
        setUserPreferences(null);
        setView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const saveUserPreferences = async (prefs) => {
    if (!session) return;
    try {
      await supabase
        .from('user_preferences')
        .upsert({ 
          id: session.user.id, 
          role: 'resident', 
          preferences: prefs 
        });
    } catch (err) {
      console.error('Error saving preferences:', err);
    }
  };

  const trackEvent = useCallback(async (eventType, eventData) => {
    try {
      await supabase.from('user_events').insert({
        user_id: session?.user?.id || null,
        event_type: eventType,
        event_data: eventData
      });
    } catch (err) {
      console.error('Analytics error:', err);
    }
  }, [session]);

  const handleCityFilter = (city) => {
    setCityFilter(city);
    trackEvent('FILTER_CITY', { city });
  };

  const handleSelectArea = (area) => {
    setSelectedArea(area);
    if (area) {
      trackEvent('VIEW_NEIGHBORHOOD', { neighborhood: area.name, city: area.city });
    }
  };
  // ─── Upgraded Matching Algorithm ───────────────────────────────────────────
  // v2: Sigmoidal commute decay + Cosine similarity + Score explainability
  const matchedNeighborhoods = useMemo(() => {
    if (!userPreferences) return [];

    const profile = userPreferences.profile || 'professional';
    const commuteLocations = userPreferences.commuteLocations || [];
    const isRemote = userPreferences.isRemote || false;
    const transitMode = userPreferences.transitMode || 'transit';
    const lifestyle = userPreferences.lifestyle || {};
    const amenityKeys = Object.keys(lifestyle).filter(k => (lifestyle[k] || 0) > 0);

    return neighborhoodsData.map(area => {

      // ── 1. Life Stage Suitability (25% weight) ────────────────────────────
      const profileKey = profile === 'professional' ? 'single_professional' : profile;
      const suitabilityScore = area[`${profileKey}_suitability`] || 5;
      const lifeStageScore = suitabilityScore * 10; // 0–100

      // ── 2. Commute Score — Sigmoidal Decay (40% weight) ───────────────────
      // Uses smooth S-curve instead of hard step-thresholds.
      // Score decays gradually past the user's ideal commute target.
      let commuteScore = 50;
      const idealMinutes = userPreferences.idealCommuteMinutes || 30;

      if (isRemote) {
        commuteScore = 80 + ((area.transit?.walkability ?? 0) * 2);
      } else if (transitMode === 'walking') {
        commuteScore = (area.transit?.walkability ?? 0) * 10;
      } else if (commuteLocations && commuteLocations.length > 0) {
        let totalScore = 0;
        let totalWeight = 0;

        commuteLocations.forEach(loc => {
          if (loc.lat && loc.lng && area.lat && area.lng) {
            const distKm = getDistanceFromLatLonInKm(loc.lat, loc.lng, area.lat, area.lng);
            let estTime = 60;
            if (transitMode === 'driving') estTime = (distKm * 2.5) + 5;
            if (transitMode === 'transit') estTime = (distKm * 4.5) + 10;

            // Sigmoidal decay — smooth psychological accuracy
            const locScore = sigmoidCommuteScore(estTime, idealMinutes);

            let weight = 1;
            if (loc.frequency === 'daily')    weight = 5;
            if (loc.frequency === 'frequent') weight = 3;

            totalScore  += locScore * weight;
            totalWeight += weight;
          }
        });

        commuteScore = totalWeight > 0
          ? totalScore / totalWeight
          : (area.transit?.walkability ?? 0) * 8;
      } else {
        commuteScore = (area.transit?.walkability ?? 0) * 8;
      }

      // ── 3. Lifestyle Match — Cosine Similarity (25% weight) ───────────────
      // Treats user preferences and neighborhood attributes as vectors.
      // Cosine similarity captures holistic vibe alignment, not just averages.
      let amenitiesScore = 50;
      if (amenityKeys.length > 0) {
        // Blend cosine similarity (holistic) with must-have penalty (hard constraints)
        const cosineSim = cosineLifestyleSimilarity(lifestyle, area.amenities, amenityKeys);

        // Apply hard penalty for unmet must-haves
        let mustHavePenalty = 0;
        amenityKeys.forEach(key => {
          if (lifestyle[key] === 2 && (area.amenities?.[key] ?? 5) < 5) {
            mustHavePenalty += 15; // unmet must-have — deduct 15pts each
          }
        });
        amenitiesScore = Math.max(0, cosineSim - mustHavePenalty);
      } else {
        amenitiesScore = 75; // no preferences set — neutral
      }

      // ── 4. Budget & Affordability Penalty (10% weight) ───────────────────
      let budgetPenalty = 0;
      if (profile === 'student' && area.priceBracket === '$$$$') budgetPenalty = 25;
      else if (profile === 'student' && area.priceBracket === '$$$')  budgetPenalty = 12;

      // ── 5. Total Compatibility Score ──────────────────────────────────────
      const hasCommuteLocs = commuteLocations && commuteLocations.length > 0 && !isRemote;
      const wCommute   = hasCommuteLocs ? 0.55 : 0.35;
      const wLifeStage = hasCommuteLocs ? 0.20 : 0.25;
      const wAmenities = hasCommuteLocs ? 0.20 : 0.30;
      const wWalk      = hasCommuteLocs ? 0.05 : 0.10;

      const rawScore =
        (lifeStageScore * wLifeStage) +
        (commuteScore   * wCommute) +
        (amenitiesScore * wAmenities) +
        ((area.transit?.walkability ?? 0) * 10 * wWalk) - // walkability bonus
        budgetPenalty;

      const finalScore = Math.min(99, Math.max(40, Math.round(rawScore)));

      const subScores = {
        lifeStage:  Math.round(lifeStageScore),
        commute:    Math.min(100, Math.round(commuteScore)),
        amenities:  Math.round(amenitiesScore),
        walkability: (area.transit?.walkability ?? 0) * 10,
      };

      // ── 6. Score Explainability Bullets ──────────────────────────────────
      const matchReasons = generateMatchExplanation(area, userPreferences, subScores);

      return {
        ...area,
        subScores,
        matchScore: finalScore,
        matchReasons,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [userPreferences]);

  const handleQuizComplete = (prefs) => {
    setUserPreferences(prefs);
    navigateTo('/results');
    // Persist to Supabase if logged in
    if (session) {
      saveUserPreferences(prefs);
    }
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
    navigateTo('/');
  };

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <header className="app-header-nav luxury-header">
        <div className="logo-wrap" onClick={handleRetakeQuiz}>
          <img src={logoWhite} alt="HomeVibes" className="brand-logo logo-dark-mode" />
          <img src={logoPurple} alt="HomeVibes" className="brand-logo logo-light-mode" />
        </div>
        <p className="header-desc">Where Your Vibes Match Home</p>
        <div className="header-right">
          <button className="btn-header-action luxury-btn-header" style={{ marginRight: '8px' }} onClick={() => navigateTo('/insights')}>
            Insights
          </button>
          {session ? (
            <button className="btn-header-action luxury-btn-header" style={{ marginRight: '8px' }} onClick={() => supabase.auth.signOut()}>
              Sign Out
            </button>
          ) : (
            <button className="btn-header-action luxury-btn-header" style={{ marginRight: '8px' }} onClick={() => setShowAuthModal(true)}>
              Sign In
            </button>
          )}
          {view === 'results' && (
            <button className="btn-header-action luxury-btn-header" onClick={handleRetakeQuiz}>
              Reset & Retake Quiz
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`app-main-content ${view === 'landing' ? 'landing-view-main' : ''}`}>
        {view === 'landing' ? (
          <LandingPage onStart={() => navigateTo('/quiz')} />
        ) : view === 'quiz' ? (
          <div className="quiz-container animate-fade-in">
            <VibeQuiz onComplete={handleQuizComplete} />
          </div>
        ) : view === 'blog' ? (
          <Blog activeSlug={activeBlogSlug} navigateTo={navigateTo} />
        ) : view === 'privacy' ? (
            <PrivacyPolicy setView={setView} navigateTo={navigateTo} />
        ) : view === 'contact' ? (
            <ContactB2B setView={setView} navigateTo={navigateTo} />
          ) : (
            <div className="results-dashboard-wrapper">
              <div className="results-layout animate-fade-in">
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
                      onClick={() => handleCityFilter(city)}
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
                          onClick={() => handleSelectArea(area)}
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

            {/* Premium Insights Banner */}
            <div className="premium-insights-banner animate-fade-in card-subglass">
              <div className="insights-content">
                <h3 className="display-font"><span style={{color: 'var(--color-primary)'}}>✦</span> Premium Market Insights</h3>
                <p>Unlock historical pricing trends, school district ratings, and predictive neighborhood gentrification models to make the perfect decision.</p>
              </div>
              <button className="btn-luxury" onClick={() => setIsPremiumUnlocked(true)}>Unlock Premium Insights</button>
            </div>
          </div>
        )}
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {/* Footer */}
      <Footer setView={setView} navigateTo={navigateTo} />
    </div>
  );
}





