import React, { useState, useEffect } from 'react';
import neighborhoodVibe from '../assets/hero_urban_data.jpg';
import dnaVisual from '../assets/neighborhood-dna.jpg';

const DataIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
    <line x1="9" y1="3" x2="9" y2="18"></line>
    <line x1="15" y1="6" x2="15" y2="21"></line>
  </svg>
);

export default function LandingPage({ onStart, onExplore }) {
  const [dataCount, setDataCount] = useState(0);

  // Simple number counter animation for the data section
  useEffect(() => {
    const interval = setInterval(() => {
      setDataCount(prev => (prev < 50 ? prev + 1 : 50));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="story-landing-page">
      {/* Background Floating Orbs for depth */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {/* Hero Section with Video */}
      <section className="story-hero-section">
        <img src={neighborhoodVibe} alt="Vibrant Neighborhood" className="story-hero-video" />
        <div className="story-hero-overlay"></div>
        
        <div className="story-hero-content fade-in-up">
          <div className="hero-badge">THE REAL ESTATE REVOLUTION</div>
          <h1 className="story-hero-headline display-font">
            Where Your Vibes <br/><span className="text-gradient">Match Home.</span>
          </h1>
          <p className="story-hero-subtext">
            Stop searching for just a physical house. Discover the perfect home in vibrant neighborhoods tailored perfectly to your personal routine, commute, and lifestyle.
          </p>
          <div className="story-hero-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="story-hero-btn pulse-glow" onClick={() => onStart && onStart()}>
              Find Your Match
            </button>
            <button className="story-hero-btn outline-btn" onClick={() => onExplore && onExplore()}>
              Explore the Map
            </button>
          </div>
        </div>
      </section>

      {/* Act 1 & 2 Combined: The Problem & The Science (Bento Grid Layout) */}
      <section className="story-act features-bento-section">
        <div className="act-content">
          
          {/* Top Intro */}
          <div className="features-intro">
            <h2 className="display-font">
              You are more than a <br/>zip code and a budget.
            </h2>
            <p className="features-intro-text">
              Traditional real estate platforms treat you like a spreadsheet. They ask for square footage and price, completely ignoring what actually matters: your lifestyle. How close is the best coffee? Is the street safe at night? Does the culture fit your vibe?
            </p>
          </div>

          {/* Bento Grid */}
          <div className="bento-grid">
            
            {/* Left Card: The Science */}
            <div className="bento-card bento-card-science">
              <div className="bento-card-content">
                <h3 className="display-font">
                  We analyze the <br/><span className="text-gradient-purple">DNA</span> of every neighborhood.
                </h3>
                <p>
                  We process massive amounts of geospatial and cultural data to score neighborhoods based on safety, amenities, transit, and social energy. We do the heavy lifting so you don't have to guess.
                </p>
              </div>
              <div className="bento-image-wrapper">
                <img 
                  src={dnaVisual} 
                  alt="Neighborhood DNA" 
                  className="bento-image"
                />
              </div>
            </div>

            {/* Right Card: The Stats Infographic */}
            <div className="bento-card bento-card-stats infographic-panel">
              
              {/* Stat 1: Data Points */}
              <div className="info-row">
                <div className="stat-icon-box stat-purple">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </div>
                <div className="stat-text-box">
                  <h3 className="display-font text-gradient-purple">{dataCount}+</h3>
                  <p>Geospatial Data Points</p>
                </div>
              </div>

              {/* Stat 2: Personalized Scoring */}
              <div className="info-row-bar">
                <div className="stat-bar-header">
                  <p>Algorithm Personalization</p>
                  <h3 className="display-font text-purple">100%</h3>
                </div>
                <div className="stat-bar-bg">
                  <div className="stat-bar-fill"></div>
                </div>
              </div>

              {/* Stat 3: Neighborhoods */}
              <div className="info-row">
                <div className="stat-icon-box stat-blue">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div className="stat-text-box">
                  <h3 className="display-font text-blue">140+</h3>
                  <p>GTA Neighborhoods</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Act 3: The Magic / Result */}
      <section className="story-act story-act-magic">
        <div className="act-content magic-flex">
          <div className="magic-mockup float-animation">
            <div className="mockup-card">
              <div className="mockup-header">
                <MapIcon /> <span>Trinity Bellwoods</span>
              </div>
              <div className="mockup-score text-gradient">98% Match</div>
              <div className="mockup-bar"><div className="mockup-fill"></div></div>
              <p className="mockup-desc">Perfect for your cafe routine & transit needs.</p>
            </div>
          </div>
          <div className="magic-text-side">
            <div className="icon-glow-wrapper"><HeartIcon /></div>
            <h2 className="act-title">Find your people. <br/>Find your vibe.</h2>
            <p className="act-text">
              Take our interactive Vibe Quiz to tell us who you are. We'll instantly match you with the neighborhoods where you truly belong.
            </p>
            <button className="story-hero-btn outline-btn" onClick={() => onStart && onStart()}>
              Start the Vibe Quiz
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
