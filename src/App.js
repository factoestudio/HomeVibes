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

import { generateDynamicIsochroneZones } from './utils/isochroneGenerator';

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
const DEFAULT_PREFERENCES = {
  profile: 'professional',
  commuteLocations: [{ address: 'Downtown Toronto', lat: 43.6532, lng: -79.3832, frequency: 'daily' }],
  isRemote: false,
  transitMode: 'transit',
  lifestyle: { cafes_restaurants: 1, parks_nature: 1 }
};

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'quiz' | 'results' | 'privacy' | 'contact' | 'blog'
  const [activeBlogSlug, setActiveBlogSlug] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [cityFilter, setCityFilter] = useState('All');

  // Auth State
  const [session, setSession] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [customSearchAddress, setCustomSearchAddress] = useState('');
  const [isSearchingAnchor, setIsSearchingAnchor] = useState(false);

  const handleSetCustomAnchor = async (e) => {
    e?.preventDefault();
    if (!customSearchAddress.trim()) return;
    setIsSearchingAnchor(true);
    try {
      const cleanAddr = customSearchAddress.trim();
      const queries = [
        /ontario|canada/i.test(cleanAddr) ? cleanAddr : `${cleanAddr}, Ontario, Canada`,
        cleanAddr,
        `${cleanAddr}, Canada`
      ];

      for (const q of queries) {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`, {
          headers: { 'User-Agent': 'HomeVibesApp/1.0' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const newLoc = {
              address: customSearchAddress,
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
              frequency: 'daily'
            };
            setUserPreferences(prev => ({
              ...(prev || DEFAULT_PREFERENCES),
              isRemote: false,
              commuteLocations: [newLoc]
            }));
            break;
          }
        }
      }
    } catch (err) {
      console.error("Custom anchor search error:", err);
    } finally {
      setIsSearchingAnchor(false);
    }
  };

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
      setView('results');
    } else {
      if (userPreferences) {
        setView('results');
      } else {
        setView('landing');
      }
    }
  }, [userPreferences]);



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
    const prefs = userPreferences || DEFAULT_PREFERENCES;

    const profile = prefs.profile || 'professional';
    const commuteLocations = prefs.commuteLocations || [];
    const isRemote = prefs.isRemote || false;
    const transitMode = prefs.transitMode || 'transit';
    const lifestyle = prefs.lifestyle || {};
    const amenityKeys = Object.keys(lifestyle).filter(k => (lifestyle[k] || 0) > 0);

    // 1. Generate dynamic spatial micro-zone candidates around ALL user anchor locations
    let dynamicIsochroneAreas = [];
    if (commuteLocations && commuteLocations.length > 0) {
      commuteLocations.forEach(loc => {
        if (loc.lat && loc.lng) {
          const zones = generateDynamicIsochroneZones(loc, prefs);
          dynamicIsochroneAreas.push(...zones);
        }
      });
    }

    // 2. Combine static curated dataset + dynamic isochrone spatial candidates
    const pool = [...neighborhoodsData, ...dynamicIsochroneAreas];

    return pool.map(area => {
      if (area.isDynamicArea) return area; // already evaluated with exact spatial metrics

      // ── 1. Life Stage Suitability (25% weight) ────────────────────────────
      const profileKey = profile === 'professional' ? 'single_professional' : profile;
      const suitabilityScore = area[`${profileKey}_suitability`] || 5;
      const lifeStageScore = suitabilityScore * 10; // 0–100

      // ── 2. Commute Score — Sigmoidal Decay (40% weight) ───────────────────
      // Uses smooth S-curve instead of hard step-thresholds.
      // Score decays gradually past the user's ideal commute target.
      let commuteScore = 50;
      const idealMinutes = prefs.idealCommuteMinutes || 30;

      let minEstTime = Infinity;
      let minDistKm = Infinity;

      if (isRemote) {
        commuteScore = 80 + ((area.transit?.walkability ?? 0) * 2);
      } else if (commuteLocations && commuteLocations.length > 0) {
        let totalScore = 0;
        let totalWeight = 0;

        commuteLocations.forEach(loc => {
          if (loc.lat && loc.lng && area.lat && area.lng) {
            const distKm = getDistanceFromLatLonInKm(loc.lat, loc.lng, area.lat, area.lng);
            if (distKm < minDistKm) minDistKm = distKm;

            let estTime = 60;
            if (transitMode === 'driving') estTime = (distKm * 2.2) + 4;
            if (transitMode === 'transit') estTime = (distKm * 4.2) + 8;
            if (transitMode === 'walking') estTime = distKm * 12;

            if (estTime < minEstTime) minEstTime = estTime;

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
      } else if (transitMode === 'walking') {
        commuteScore = (area.transit?.walkability ?? 0) * 10;
      } else {
        commuteScore = (area.transit?.walkability ?? 0) * 8;
      }

      const closestEstTime = minEstTime !== Infinity ? Math.round(minEstTime) : null;
      const isWithinIsochroneBuffer = closestEstTime !== null ? closestEstTime <= idealMinutes : false;
      const isochroneBufferBadge = (commuteLocations && commuteLocations.length > 0 && !isRemote && closestEstTime !== null)
        ? (isWithinIsochroneBuffer 
            ? `🎯 Within ${closestEstTime}-min Commute Isochrone Buffer` 
            : `⏱️ ${closestEstTime}-min Commute (${closestEstTime - idealMinutes}m over target)`)
        : null;

      // ── 3. Lifestyle Match — Cosine Similarity (25% weight) ───────────────
      // Treats user preferences and neighborhood attributes as vectors.
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

      // ── 5. Total Compatibility Score & Geodesic Distance Penalty ─────────
      const hasCommuteLocs = commuteLocations && commuteLocations.length > 0 && !isRemote;
      const wCommute   = hasCommuteLocs ? 0.60 : 0.35;
      const wLifeStage = hasCommuteLocs ? 0.15 : 0.25;
      const wAmenities = hasCommuteLocs ? 0.20 : 0.30;
      const wWalk      = hasCommuteLocs ? 0.05 : 0.10;

      const rawScore =
        (lifeStageScore * wLifeStage) +
        (commuteScore   * wCommute) +
        (amenitiesScore * wAmenities) +
        ((area.transit?.walkability ?? 0) * 10 * wWalk) -
        budgetPenalty;

      // Strict out-of-corridor distance multiplier
      let distanceMultiplier = 1.0;
      if (hasCommuteLocs && minDistKm !== Infinity) {
        if (minDistKm > 45)      distanceMultiplier = 0.15; // 85% penalty for areas >45km away
        else if (minDistKm > 30) distanceMultiplier = 0.40; // 60% penalty for areas >30km away
        else if (minDistKm > 18) distanceMultiplier = 0.75; // 25% penalty for areas >18km away
      }

      const finalScore = Math.min(99, Math.max(15, Math.round(rawScore * distanceMultiplier)));

      const subScores = {
        lifeStage:  Math.round(lifeStageScore),
        commute:    Math.min(100, Math.round(commuteScore)),
        amenities:  Math.round(amenitiesScore),
        walkability: (area.transit?.walkability ?? 0) * 10,
      };

      // ── 6. Score Explainability Bullets ──────────────────────────────────
      const matchReasons = generateMatchExplanation(area, prefs, subScores);

      return {
        ...area,
        subScores,
        matchScore: finalScore,
        matchReasons,
        closestEstTime,
        isWithinIsochroneBuffer,
        isochroneBufferBadge
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [userPreferences, DEFAULT_PREFERENCES]);

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
    if (!cityFilter || cityFilter.toUpperCase() === 'ALL') return matchedNeighborhoods;
    return matchedNeighborhoods.filter(area => area.city && area.city.toUpperCase().includes(cityFilter.toUpperCase()));
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

                  {/* Dynamic Location Isochrone Search Bar */}
                  <form onSubmit={handleSetCustomAnchor} style={{ margin: '12px 0 6px 0', display: 'flex', gap: '6px' }}>
                    <input 
                      type="text" 
                      placeholder="Search ANY GTA location (e.g. Square One, Unionville, High Park)..." 
                      value={customSearchAddress}
                      onChange={(e) => setCustomSearchAddress(e.target.value)}
                      className="luxury-input"
                      style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.82rem', borderRadius: '8px' }}
                    />
                    <button 
                      type="submit" 
                      className="btn-header-action luxury-btn-header"
                      disabled={isSearchingAnchor || !customSearchAddress.trim()}
                      style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                    >
                      {isSearchingAnchor ? 'Searching...' : '🎯 Evaluate Location'}
                    </button>
                  </form>
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
                          {area.isochroneBufferBadge && (
                            <div style={{ margin: '6px 0', fontSize: '0.78rem', fontWeight: 600, color: area.isWithinIsochroneBuffer ? '#4ADE80' : '#FBBF24', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '12px', background: area.isWithinIsochroneBuffer ? 'rgba(74, 222, 128, 0.12)' : 'rgba(251, 191, 36, 0.12)', border: area.isWithinIsochroneBuffer ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)' }}>
                              {area.isochroneBufferBadge}
                            </div>
                          )}
                          <p className="match-card-desc">{area.description.substring(0, 100)}...</p>
                          <div className="match-card-meta">
                            <span className="platinum-text">Class: {area.priceBracket}</span>
                            <span>Walkability: {area.transit?.walkability ?? 0}/10</span>
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
                <h3 className="display-font"><span style={{color: 'var(--color-primary)'}}>✦</span> Premium Market Insights & Data Reports</h3>
                <p>Explore historical pricing trends, school district ratings, urban planning reports, and predictive neighborhood gentrification models.</p>
              </div>
              <button 
                type="button" 
                className="btn-header-action luxury-btn-header" 
                onClick={() => navigateTo('/insights')}
                style={{ padding: '0.75rem 1.35rem', fontSize: '0.9rem', whiteSpace: 'nowrap', cursor: 'pointer' }}
              >
                Explore Insights &rarr;
              </button>
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





