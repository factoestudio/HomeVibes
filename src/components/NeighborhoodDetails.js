import React, { useState } from 'react';
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

  const handleUnlockSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const { error } = await supabase.from('leads').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          timeline: formData.timeline,
          created_at: new Date().toISOString()
        }
      ]);
      if (error) throw error;
      setIsPremiumUnlocked(true);
    } catch (err) {
      console.error('Error submitting lead:', err);
      setSubmitError('Failed to unlock. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!selectedArea) {
    return (
      <div className="details-empty-state card-glass luxury-border">
        <div className="empty-icon gold-text"><MarkerIcon size={48} /></div>
        <h3 className="display-font">Select a Neighborhood</h3>
        <p>Click on any gold marker on the map or select a neighborhood from the list to view its lifestyle suitabilities, budget comparison, and live real estate portals.</p>
      </div>
    );
  }

  const matchColor = getScoreColor(selectedArea.matchScore);

  // Get travel time details based on quiz selections
  const userHub = userPreferences?.hub || 'downtown';
  const userTransit = userPreferences?.transitMode || 'transit';
  const commuteTime = selectedArea.commutes[userHub]?.[userTransit] || 'N/A';

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
  const activeFilters = filters || {
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

  // Filter listings based on global filter bar state
  const filteredListings = (selectedArea.listings || []).filter(listing => {
    // 1. Tenure filter
    if (listing.tenure !== tenure) return false;
    
    // 2. Max Price filter
    if (listing.priceNum > maxPrice) return false;
    
    // 3. Property Type filter
    if (!activeFilters.selectedTypes.includes(listing.type)) return false;
    
    // 4. Beds filter (minimum)
    if (listing.beds < activeFilters.beds) return false;
    
    // 5. Baths filter (minimum)
    if (listing.baths < activeFilters.baths) return false;
    
    // 6. Parking filter
    if (activeFilters.parkingRequired && !listing.parking) return false;
    
    return true;
  });

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
        <div className="match-score-section card-subglass luxury-subcard">
          <div className="score-ring-container">
            <svg className="score-ring-svg" viewBox="0 0 100 100">
              <circle className="score-ring-bg" cx="50" cy="50" r="42" />
              <circle 
                className="score-ring-fill" 
                cx="50" 
                cy="50" 
                r="42" 
                style={{
                  strokeDasharray: `${2 * Math.PI * 42}`,
                  strokeDashoffset: `${2 * Math.PI * 42 * (1 - selectedArea.matchScore / 100)}`,
                  stroke: matchColor
                }}
              />
            </svg>
            <div className="score-ring-text" style={{ color: matchColor }}>
              <span className="score-number display-font">{selectedArea.matchScore}%</span>
              <span className="score-label uppercase">Match</span>
            </div>
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
          {selectedArea.tags.map(tag => (
            <span key={tag} className="tag-pill luxury-tag">#{tag}</span>
          ))}
        </div>

        {/* Description */}
        <div className="details-section">
          <h3 className="display-font">Vibe Overview</h3>
          <p className="details-description">{selectedArea.description}</p>
        </div>

        {/* Budget Comparison Card */}
        <div className="details-section budget-comparison-card card-subglass luxury-subcard">
          <h3 className="display-font"><span className="title-icon-inline gold-text"><WalletIcon size={18} /></span> Budget Alignment</h3>
          <div className="budget-comparison-row">
            <div className="budget-compare-item">
              <span className="compare-title">YOUR LIMIT</span>
              <span className="compare-value gold-text">
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
            <h3 className="display-font"><span className="title-icon-inline gold-text"><ClockIcon size={18} /></span> Proximity & Commute</h3>
            <p className="commute-destination">
              Commute to <strong>{hubNames[userHub]}</strong>
            </p>
            <div className="commute-stat-box">
              <span className="commute-icon gold-text"><ClockIcon size={20} /></span>
              <div className="commute-value-wrap">
                <span className="commute-time">{commuteTime} minutes</span>
                <span className="commute-method uppercase">via {transitIcons[userTransit]}</span>
              </div>
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
              const isActive = userPreferences?.profile === ['student', 'professional', 'family', 'senior'][idx];
              return (
                <div key={idx} className={`suitability-item card-subglass luxury-subcard ${isActive ? 'active-profile-match' : ''}`}>
                  <div className="suit-header">
                    <span className="suit-icon">{stage.icon}</span>
                    <span className="suit-label">{stage.label}</span>
                  </div>
                  <span className="suit-score gold-text">{stage.score}/10</span>
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
              { key: 'cafes_restaurants', label: 'Cafes & Dining', icon: <CafesIcon size={16} />, score: selectedArea.amenities.cafes_restaurants },
              { key: 'malls_shopping', label: 'Malls & Retail', icon: <MallsIcon size={16} />, score: selectedArea.amenities.malls_shopping },
              { key: 'parks_nature', label: 'Parks & Nature', icon: <NatureIcon size={16} />, score: selectedArea.amenities.parks_nature },
              { key: 'libraries_civic', label: 'Libraries & Civic', icon: <LibraryIcon size={16} />, score: selectedArea.amenities.libraries_civic },
              { key: 'premium_groceries', label: 'Organic Groceries', icon: <PremiumGroceriesIcon size={16} />, score: selectedArea.amenities.premium_groceries },
              { key: 'budget_groceries', label: 'Affordable Groceries', icon: <BudgetGroceriesIcon size={16} />, score: selectedArea.amenities.budget_groceries },
              { key: 'dog_parks', label: 'Dog Parks & Pets', icon: <DogParksIcon size={16} />, score: selectedArea.amenities.dog_parks }
            ].map(item => {
              const prefVal = userPreferences?.lifestyle?.[item.key];
              let prefLabel = "";
              if (prefVal === 2) prefLabel = "Must-Have";
              else if (prefVal === 1) prefLabel = "Nice-to-Have";

              return (
                <div key={item.key} className="meter-row">
                  <div className="meter-header">
                    <div className="meter-header-label">
                      <span className="meter-header-icon gold-text">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <div className="meter-labels">
                      {prefLabel && <span className="pref-indicator gold-pref-indicator">{prefLabel}</span>}
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
              {selectedArea.pros.map((pro, idx) => <li key={idx}>{pro}</li>)}
            </ul>
          </div>
          <div className="cons-box luxury-cons-box">
            <h4 className="uppercase">Local Realities</h4>
            <ul>
              {selectedArea.cons.map((con, idx) => <li key={idx}>{con}</li>)}
            </ul>
          </div>
        </div>

        {/* Local Attractions */}
        <div className="details-section">
          <h3 className="display-font"><span className="title-icon-inline gold-text"><MarkerIcon size={18} /></span> Famous Local Spots</h3>
          <div className="local-spots-flex">
            {selectedArea.localSpots.map((spot, idx) => (
              <span key={idx} className="spot-chip luxury-spot-chip">{spot}</span>
            ))}
          </div>
        </div>

        {/* Real Estate Platform Connections */}
        <div className="details-section real-estate-platforms">
          <h3 className="display-font"><span className="title-icon-inline gold-text"><DiamondIcon size={18} /></span> Search Live Listings</h3>
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

        {/* Featured Listings */}
        <div className="details-section listings-showcase">
          <h3 className="display-font"><span className="title-icon-inline gold-text"><BuyIcon size={18} /></span> Curated Area Listings</h3>
          <div className="listings-grid">
            {filteredListings && filteredListings.length > 0 ? (
              filteredListings.map(listing => (
                <div key={listing.id} className="listing-card card-subglass luxury-subcard luxury-listing-card">
                  <div className="listing-img-container">
                    <img 
                      src={listing.imgUrl} 
                      alt={listing.title} 
                      className="listing-img" 
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=60";
                      }}
                    />
                    <span className="listing-type luxury-listing-type">{listing.type}</span>
                  </div>
                  <div className="listing-info">
                    <div className="listing-price gold-text">{listing.price}</div>
                    <h4 className="listing-title display-font">{listing.title}</h4>
                    <p className="listing-address">{listing.address}</p>
                    <div className="listing-specs">
                      <span>{listing.beds} Beds</span>
                      <span>{listing.baths} Baths</span>
                      <span>{listing.sqft} sqft</span>
                    </div>
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
