import React, { useState } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { supabase } from '../supabaseClient';

import {
  StudentIcon,
  ProfessionalIcon,
  FamilyIcon,
  SeniorIcon,
  CafesIcon,
  MallsIcon,
  NatureIcon,
  LibraryIcon,
  PremiumGroceriesIcon,
  BudgetGroceriesIcon,
  DogParksIcon,
  RentIcon,
  BuyIcon,
  MarkerIcon,
  DiamondIcon,
  ClockIcon,
  WalletIcon
} from './SvgIcons';

export default function NeighborhoodDetails({ selectedArea, userPreferences, onClose, isPremiumUnlocked, setIsPremiumUnlocked }) {
  const [formData, setFormData] = useState({ name: '', email: '', timeline: 'Just browsing' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showDayInLife, setShowDayInLife] = useState(false);

  const handleUnlockSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const { error } = await supabase.from('contact_leads').insert([{
        full_name: formData.name,
        email: formData.email,
        timeline: formData.timeline,
        source: 'premium_unlock',
        neighborhood: selectedArea?.name,
        created_at: new Date().toISOString()
      }]);
      if (error) throw error;
      setIsPremiumUnlocked(true);
    } catch (err) {
      setSubmitError('Failed to unlock. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedArea) {
    return (
      <div className="details-empty-state card-glass luxury-border">
        <div className="empty-icon platinum-text"><MarkerIcon size={48} /></div>
        <h3 className="display-font">Select a Neighborhood</h3>
        <p>Click on any platinum marker on the map or select a neighborhood from the list to view its lifestyle suitabilities, budget comparison, and live real estate portals.</p>
      </div>
    );
  }

  const matchColor = getScoreColor(selectedArea.matchScore);

  // Build radar chart data: user ideal vs neighbourhood actual
  const buildRadarData = () => {
    const lifestyle = userPreferences?.lifestyle || {};
    const amenities = selectedArea.amenities || {};
    return [
      { axis: 'Dining',    user: (lifestyle.cafes_restaurants || 0) * 50,   area: (amenities.cafes_restaurants || 5) * 10 },
      { axis: 'Nature',    user: (lifestyle.parks_nature || 0) * 50,         area: (amenities.parks_nature || 5) * 10 },
      { axis: 'Shopping',  user: (lifestyle.malls_shopping || 0) * 50,       area: (amenities.malls_shopping || 5) * 10 },
      { axis: 'Transit',   user: (userPreferences?.transitMode === 'walking' ? 2 : 1) * 50, area: (selectedArea.transit?.walkability || 5) * 10 },
      { axis: 'Community', user: (lifestyle.libraries_civic || 0) * 50,      area: (amenities.libraries_civic || 5) * 10 },
      { axis: 'Groceries', user: (lifestyle.premium_groceries || 0) * 50,    area: (amenities.premium_groceries || 5) * 10 },
    ];
  };

  // Generate Day-in-the-Life timeline from neighbourhood data
  const buildDayInLife = () => {
    const walk = selectedArea.transit?.walkability || 5;
    const cafes = selectedArea.amenities?.cafes_restaurants || 5;
    const parks = selectedArea.amenities?.parks_nature || 5;
    const grocery = selectedArea.amenities?.premium_groceries || 5;
    const dogs = selectedArea.amenities?.dog_parks || 5;
    const transitMode = userPreferences?.transitMode || 'transit';
    const commuteLocations = userPreferences?.commuteLocations || [];
    const events = [];

    events.push({ time: '7:30 AM', icon: '☀️', text: `Wake up in ${selectedArea.name}` });

    if (cafes >= 7)
      events.push({ time: '8:00 AM', icon: '☕', text: `${cafes >= 9 ? 'Exceptional' : 'Great'} café scene — grab a flat white ${walk >= 8 ? 'steps from your door' : 'nearby'}` });
    else
      events.push({ time: '8:00 AM', icon: '🏠', text: 'Morning at home — limited café options in walking distance' });

    if (commuteLocations.length > 0 && !userPreferences?.isRemote) {
      const modeLabel = transitMode === 'driving' ? 'Drive' : transitMode === 'walking' ? 'Walk' : 'Transit ride';
      events.push({ time: '8:30 AM', icon: transitMode === 'driving' ? '🚗' : transitMode === 'walking' ? '🚶' : '🚌', text: `${modeLabel} to work — ${walk >= 7 ? 'well-connected neighbourhood' : 'plan ahead for transit'}` });
    } else if (userPreferences?.isRemote) {
      events.push({ time: '9:00 AM', icon: '💻', text: 'Work from home — no commute needed' });
    }

    if (grocery >= 7)
      events.push({ time: '12:30 PM', icon: '🛒', text: `${grocery >= 9 ? 'Whole Foods / organic market' : 'Quality grocery stores'} within easy reach` });

    if (parks >= 7)
      events.push({ time: '6:30 PM', icon: '🌳', text: `Evening walk in ${selectedArea.name}'s ${parks >= 9 ? 'outstanding' : 'excellent'} parks` });

    if (dogs >= 7)
      events.push({ time: '7:00 PM', icon: '🐕', text: `Dog parks and pet-friendly spaces nearby (${dogs}/10)` });

    events.push({ time: '9:00 PM', icon: '🏡', text: 'Home — this is your neighbourhood' });
    return events;
  };

  // Get travel time details based on quiz selections
  const userHub = userPreferences?.hub || 'downtown';
  const userTransit = userPreferences?.transitMode || 'transit';
  let commuteTime = selectedArea.commutes?.[userHub]?.[userTransit];
  if (commuteTime === undefined) {
    commuteTime = userTransit === 'walking' ? Math.round(((selectedArea.transit?.walkability || 5) / 10) * 15) : 'N/A';
  }

  // Mapping readable hub names
  const hubNames = {
    'downtown': 'Downtown Toronto Core',
    'north-york': 'North York Sub-center',
    'mississauga': 'Mississauga City Centre',
    'markham': 'Markham Tech District'
  };

  const transitIcons = {
    'walking': 'Walking',
    'transit': 'Public Transit',
    'driving': 'Driving'
  };

  // Safe fallback for filters state
  const activeFilters = {
    tenure: userPreferences?.tenure || 'rent',
    maxPrice: userPreferences?.maxPrice || (userPreferences?.tenure === 'buy' ? 1200000 : 2600),
    beds: userPreferences?.beds || 1,
    baths: userPreferences?.baths || 1,
    parkingRequired: userPreferences?.parkingRequired || false,
    selectedTypes: userPreferences?.selectedTypes || ['Condo', 'House', 'Townhouse', 'Loft']
  };

  const tenure = activeFilters.tenure;
  const maxPrice = activeFilters.maxPrice;
  const avgCostNum = tenure === 'rent' ? selectedArea.avgRentNum : selectedArea.avgBuyNum;
  
  let budgetMessage = "";
  let budgetStatusClass = "";

  if (avgCostNum <= maxPrice) {
    budgetMessage = "Excellent Fit (Within Your Limit)";
    budgetStatusClass = "fit-good";
  } else {
    const diff = avgCostNum - maxPrice;
    budgetMessage = `Over Budget (+${formatCurrencyLabel(diff)} above your limit)`;
    budgetStatusClass = "fit-bad";
  }

  // Listings were removed.

  return (
    <div className="details-panel card-glass luxury-border fade-in">
      <div className="details-header">
        <div className="details-title-wrap">
          <span className="details-city uppercase">{selectedArea.city}</span>
          <h2 className="details-name display-font">{selectedArea.name}</h2>
        </div>
        <button className="btn-close" onClick={onClose} aria-label="Close panel">&times;</button>
      </div>

      <div className="details-body luxury-scroll">
        {/* Match Score & Key Metrics */}
        <div className="match-score-section card-subglass luxury-subcard" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="dials-container" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Main Dial */}
            <div className="score-ring-container main-dial" style={{ width: '120px', height: '120px', position: 'relative' }}>
              <svg className="score-ring-svg" viewBox="0 0 100 100">
                <circle className="score-ring-bg" cx="50" cy="50" r="42" fill="none" strokeWidth="6" />
                <circle 
                  className="score-ring-fill" 
                  cx="50" cy="50" r="42" 
                  fill="none" strokeWidth="6" strokeLinecap="round"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 42}`,
                    strokeDashoffset: `${2 * Math.PI * 42 * (1 - (selectedArea.matchScore || 0) / 100)}`,
                    stroke: matchColor
                  }}
                />
              </svg>
              <div className="score-ring-text" style={{ color: matchColor }}>
                <span className="score-number display-font" style={{ fontSize: '28px', fontWeight: 'bold' }}>{selectedArea.matchScore || 0}%</span>
                <span className="score-label uppercase" style={{ fontSize: '10px', letterSpacing: '1px' }}>Total Match</span>
              </div>
            </div>

            {/* Sub Dials */}
            {selectedArea.subScores && ['commute', 'amenities', 'lifeStage'].map((key) => {
              const score = selectedArea.subScores[key] || 0;
              const label = key === 'commute' ? 'Commute' : key === 'amenities' ? 'Amenities' : 'Life Stage';
              const subColor = getScoreColor(score);
              return (
                <div key={key} className="score-ring-container sub-dial" style={{ width: '80px', height: '80px', position: 'relative' }}>
                  <svg className="score-ring-svg" viewBox="0 0 100 100">
                    <circle className="score-ring-bg" cx="50" cy="50" r="42" fill="none" strokeWidth="8" />
                    <circle 
                      className="score-ring-fill" 
                      cx="50" cy="50" r="42" 
                      fill="none" strokeWidth="8" strokeLinecap="round"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 42}`,
                        strokeDashoffset: `${2 * Math.PI * 42 * (1 - score / 100)}`,
                        stroke: subColor
                      }}
                    />
                  </svg>
                  <div className="score-ring-text" style={{ color: subColor }}>
                    <span className="score-number display-font" style={{ fontSize: '18px', fontWeight: 'bold' }}>{score}%</span>
                    <span className="score-label uppercase" style={{ fontSize: '8px', letterSpacing: '0.5px' }}>{label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="key-metrics-grid">
            <div className="metric-badge luxury-badge">
              <span className="metric-icon"><DiamondIcon size={14} color="#C5A880" /></span>
              <div className="metric-info">
                <span className="metric-title uppercase">Price Class</span>
                <span className="metric-value">{selectedArea.priceBracket}</span>
              </div>
            </div>
            <div className="metric-badge luxury-badge">
              <span className="metric-icon"><BuyIcon size={14} color="#C5A880" /></span>
              <div className="metric-info">
                <span className="metric-title uppercase">Avg Buy Price</span>
                <span className="metric-value">{selectedArea.avgBuy}</span>
              </div>
            </div>
            <div className="metric-badge luxury-badge">
              <span className="metric-icon"><RentIcon size={14} color="#C5A880" /></span>
              <div className="metric-info">
                <span className="metric-title uppercase">Avg Rent Price</span>
                <span className="metric-value">{selectedArea.avgRent}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="details-tags">
          {selectedArea.tags?.map(tag => (
            <span key={tag} className="tag-pill luxury-tag">#{tag}</span>
          ))}
        </div>

        {/* Radar Chart — Vibe Alignment */}
        {userPreferences && (
          <div className="details-section card-subglass luxury-subcard" style={{ padding: '1.25rem' }}>
            <h3 className="display-font" style={{ marginBottom: '0.5rem' }}>⬡ Vibe Alignment Radar</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--color-primary)' }}>■</span> Your Ideal &nbsp;
              <span style={{ color: '#C5A880' }}>■</span> This Neighbourhood
            </p>
            <ResponsiveContainer width="100%" height={210}>
              <RadarChart data={buildRadarData()} outerRadius={72}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: '#a0a0b0', fontSize: 11 }} />
                <Radar name="Your Ideal" dataKey="user" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.25} />
                <Radar name="Neighbourhood" dataKey="area" stroke="#C5A880" fill="#C5A880" fillOpacity={0.2} />
                <Tooltip
                  contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(197,168,128,0.3)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value, name) => [`${Math.round(value)}`, name]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Description */}
        <div className="details-section">
          <h3 className="display-font">Vibe Overview</h3>
          <p className="details-description">{selectedArea.description}</p>
        </div>

        {/* Why This Match — Score Explainability */}
        {selectedArea.matchReasons && selectedArea.matchReasons.length > 0 && (
          <div className="details-section card-subglass luxury-subcard" style={{ padding: '1.25rem' }}>
            <h3 className="display-font" style={{ marginBottom: '0.75rem' }}>✦ Why This Match?</h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedArea.matchReasons.map((reason, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: reason.type === 'positive' ? '#a8c5a0' : '#c5a880' }}>
                  <span style={{ flexShrink: 0 }}>{reason.type === 'positive' ? '✅' : '⚠️'}</span>
                  <span>{reason.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Budget Comparison Card */}
        <div className="details-section budget-comparison-card card-subglass luxury-subcard">
          <h3 className="display-font"><span className="title-icon-inline platinum-text"><WalletIcon size={18} /></span> Budget Alignment</h3>
          <div className="budget-comparison-row">
            <div className="budget-compare-item">
              <span className="compare-title">YOUR LIMIT</span>
              <span className="compare-value platinum-text">
                {formatCurrencyLabel(maxPrice)}{tenure === 'rent' ? '/mo' : ''}
              </span>
            </div>
            <div className="budget-compare-divider">vs</div>
            <div className="budget-compare-item">
              <span className="compare-title">AREA AVERAGE</span>
              <span className="compare-value">
                {tenure === 'rent' ? selectedArea.avgRent : selectedArea.avgBuy}
              </span>
            </div>
          </div>
          <div className={`budget-status-label ${budgetStatusClass}`}>
            {budgetMessage}
          </div>
        </div>

        {/* Commute Breakdown */}
        {userPreferences && (
          <div className="details-section commute-breakdown card-subglass luxury-subcard">
            <h3 className="display-font"><span className="title-icon-inline platinum-text"><ClockIcon size={18} /></span> Proximity & Commute</h3>
            <p className="commute-destination">
              Commute to <strong>{hubNames[userHub]}</strong>
            </p>
            <div className="commute-stat-box">
              <span className="commute-icon platinum-text"><ClockIcon size={20} /></span>
              <div className="commute-value-wrap">
                <span className="commute-time">{commuteTime} minutes</span>
                <span className="commute-method uppercase">via {transitIcons[userTransit]}</span>
              </div>
            </div>

            {/* Day-in-the-Life Simulator */}
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => setShowDayInLife(v => !v)}
                style={{
                  background: 'none', border: '1px solid rgba(197,168,128,0.35)',
                  color: '#C5A880', borderRadius: '8px', padding: '0.4rem 0.9rem',
                  fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.5px',
                  display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}
              >
                {showDayInLife ? '▲ Hide' : '▶ Day-in-the-Life Simulator'}
              </button>
              {showDayInLife && (
                <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {buildDayInLife().map((evt, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{evt.icon}</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600, letterSpacing: '0.5px' }}>{evt.time}</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{evt.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`premium-content-wrapper ${!isPremiumUnlocked ? 'locked' : ''}`}>
          {/* Life Stage Suitability */}
        <div className="details-section">
          <h3 className="display-font">Life Stage Compatibility</h3>
          <div className="suitability-grid">
            {[
              { label: 'Academic & Student', icon: <StudentIcon size={16} />, score: selectedArea.student_suitability },
              { label: 'Single Professional', icon: <ProfessionalIcon size={16} />, score: selectedArea.single_professional_suitability },
              { label: 'Growing Family', icon: <FamilyIcon size={16} />, score: selectedArea.family_suitability },
              { label: 'Downsizer & Senior', icon: <SeniorIcon size={16} />, score: selectedArea.senior_suitability }
            ].map((stage, idx) => {
              const activeProfileKey = userPreferences?.profile === 'professional' ? 'single_professional' : userPreferences?.profile;
              const isActive = activeProfileKey === ['student', 'single_professional', 'family', 'senior'][idx];
              return (
                <div key={idx} className={`suitability-item card-subglass luxury-subcard ${isActive ? 'active-profile-match' : ''}`}>
                  <div className="suit-header">
                    <span className="suit-icon">{stage.icon}</span>
                    <span className="suit-label">{stage.label}</span>
                  </div>
                  <span className="suit-score platinum-text">{stage.score}/10</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Amenities Detail */}
        <div className="details-section">
          <h3 className="display-font">Lifestyle & Amenities Breakdown</h3>
          <div className="amenities-meters">
            {[
              { key: 'cafes_restaurants', label: 'Cafes & Dining', icon: <CafesIcon size={16} />, score: selectedArea.amenities?.cafes_restaurants || 0 },
              { key: 'malls_shopping', label: 'Malls & Retail', icon: <MallsIcon size={16} />, score: selectedArea.amenities?.malls_shopping || 0 },
              { key: 'parks_nature', label: 'Parks & Nature', icon: <NatureIcon size={16} />, score: selectedArea.amenities?.parks_nature || 0 },
              { key: 'libraries_civic', label: 'Libraries & Civic', icon: <LibraryIcon size={16} />, score: selectedArea.amenities?.libraries_civic || 0 },
              { key: 'premium_groceries', label: 'Organic Groceries', icon: <PremiumGroceriesIcon size={16} />, score: selectedArea.amenities?.premium_groceries || 0 },
              { key: 'budget_groceries', label: 'Affordable Groceries', icon: <BudgetGroceriesIcon size={16} />, score: selectedArea.amenities?.budget_groceries || 0 },
              { key: 'dog_parks', label: 'Dog Parks & Pets', icon: <DogParksIcon size={16} />, score: selectedArea.amenities?.dog_parks || 0 }
            ].map(item => {
              const prefVal = userPreferences?.lifestyle?.[item.key];
              let prefLabel = "";
              if (prefVal === 2) prefLabel = "Must-Have";
              else if (prefVal === 1) prefLabel = "Nice-to-Have";

              return (
                <div key={item.key} className="meter-row">
                  <div className="meter-header">
                    <div className="meter-header-label">
                      <span className="meter-header-icon platinum-text">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <div className="meter-labels">
                      {prefLabel && <span className="pref-indicator platinum-pref-indicator">{prefLabel}</span>}
                      <span className="meter-score">{item.score}/10</span>
                    </div>
                  </div>
                  <div className="meter-bar-bg">
                    <div 
                      className="meter-bar-fill" 
                      style={{ 
                        width: `${item.score * 10}%`,
                        backgroundColor: prefVal === 2 ? '#D4AF37' : '#C5A880'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="details-section pros-cons-grid">
          <div className="pros-box luxury-pros-box">
            <h4 className="uppercase">Area Highlights</h4>
            <ul>
              {selectedArea.pros?.map((pro, idx) => <li key={idx}>{pro}</li>)}
            </ul>
          </div>
          <div className="cons-box luxury-cons-box">
            <h4 className="uppercase">Local Realities</h4>
            <ul>
              {selectedArea.cons?.map((con, idx) => <li key={idx}>{con}</li>)}
            </ul>
          </div>
        </div>

        {/* Local Attractions */}
        <div className="details-section">
          <h3 className="display-font"><span className="title-icon-inline platinum-text"><MarkerIcon size={18} /></span> Famous Local Spots</h3>
          <div className="local-spots-flex">
            {selectedArea.localSpots?.map((spot, idx) => (
              <span key={idx} className="spot-chip luxury-spot-chip">{spot}</span>
            ))}
          </div>
        </div>

        {/* Real Estate Platform Connections */}
        <div className="details-section real-estate-platforms">
          <h3 className="display-font"><span className="title-icon-inline platinum-text"><DiamondIcon size={18} /></span> Search Live Listings</h3>
          <p className="platform-sub">Deep-link to active properties in {selectedArea.name}:</p>
          <div className="platform-buttons-grid">
            <a 
              href={selectedArea.realtorLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="platform-btn luxury-platform-btn"
            >
              Realtor.ca
            </a>
            <a 
              href={selectedArea.zoloLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="platform-btn luxury-platform-btn"
            >
              Zolo.ca
            </a>
            <a 
              href={selectedArea.houseSigmaLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="platform-btn luxury-platform-btn"
            >
              HouseSigma
            </a>
          </div>
        </div>

        {/* Featured Listings Removed */}
      </div> {/* Closes premium-content-wrapper BEFORE the overlay */}

      {/* Lead Capture Overlay (Now Clickable & Sharp) */}
      {!isPremiumUnlocked && (
        <div className="lead-capture-overlay card-glass luxury-border fade-in">
          <h3 className="display-font premium-unlock-title">Connect with a Local Specialist</h3>
          <p className="premium-unlock-desc">Unlock deep lifestyle analytics for {selectedArea.name} and let our VIP concierges curate a bespoke list of off-market homes tailored to your vibe.</p>
          <form onSubmit={handleUnlockSubmit} className="lead-form">
            <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="luxury-input" />
            <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="luxury-input" />
            <select required value={formData.timeline} onChange={e => setFormData({ ...formData, timeline: e.target.value })} className="luxury-select timeline-select">
              <option value="Just browsing">Just browsing</option>
              <option value="1-3 months">Looking to move in 1-3 months</option>
              <option value="3-6 months">Looking to move in 3-6 months</option>
              <option value="6+ months">Looking to move in 6+ months</option>
            </select>
            {submitError && <div className="form-error">{submitError}</div>}
            <button type="submit" disabled={isSubmitting} className="btn-primary unlock-btn">
              {isSubmitting ? 'Unlocking...' : 'Unlock Deep-Dive Analysis'}
            </button>
          </form>
        </div>
      )}
      </div> {/* Closes details-body */}
    </div>
  );
}

// Helpers
const getScoreColor = (score) => {
  if (score >= 90) return '#D4AF37';
  if (score >= 75) return '#C5A880';
  if (score >= 60) return '#8E7557';
  return '#4A4B54';
};

const formatCurrencyLabel = (val) => {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
  return `$${val}`;
};

