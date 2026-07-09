import React from 'react';
import neighborhoodVibe from '../assets/neighborhood_vibe.png';

const CompassIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="18" y="3" width="4" height="18"></rect>
    <rect x="10" y="8" width="4" height="13"></rect>
    <rect x="2" y="13" width="4" height="8"></rect>
  </svg>
);

const TransitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.94A5.96 5.96 0 0 0 12 19a5.96 5.96 0 0 0 8-4.06"></path>
    <path d="M12 19v3"></path>
    <path d="M9 22h6"></path>
    <path d="M12 3v2"></path>
    <path d="M6 7l1.5-1.5"></path>
    <path d="M16.5 5.5L18 7"></path>
    <circle cx="12" cy="11" r="3"></circle>
  </svg>
);

export default function LandingPage({ onStart }) {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section 
        className="hero-section" 
        style={{ backgroundImage: `url(${neighborhoodVibe})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content fade-in-up">
          <h1 className="hero-headline display-font">
            Where Your Vibes Match Home
          </h1>
          <p className="hero-subtext">
            Stop searching for just a physical house. Discover the perfect home in vibrant neighborhoods perfectly tailored to your personal routine, commute, and lifestyle—no matter who you are or what you're looking for.
          </p>
          <button 
            className="luxury-btn pulse-glow hero-cta" 
            onClick={onStart}
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-card slide-up-1">
            <div className="feature-icon-wrapper">
              <CompassIcon />
            </div>
            <h3 className="feature-title">Vibe Matching</h3>
            <p className="feature-text">Aligning the perfect neighborhood with your daily routine and comfort.</p>
          </div>
          
          <div className="feature-card slide-up-2">
            <div className="feature-icon-wrapper">
              <ChartIcon />
            </div>
            <h3 className="feature-title">Deep Analytics</h3>
            <p className="feature-text">Data-driven neighborhood insights on safety, culture, and amenities.</p>
          </div>
          
          <div className="feature-card slide-up-3">
            <div className="feature-icon-wrapper">
              <TransitIcon />
            </div>
            <h3 className="feature-title">Seamless Commute</h3>
            <p className="feature-text">Integration with your daily travel to optimize your commute time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
