import React from 'react';

export default function LandingPage({ onStart }) {
  return (
    <div className="landing-container fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh', 
      textAlign: 'center',
      padding: '2rem' 
    }}>
      <h1 className="display-font" style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        Discover Your Perfect Neighborhood
      </h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem auto', opacity: 0.8, lineHeight: 1.6 }}>
        Revolutionizing home search by connecting people with neighborhoods that match their lifestyle. 
        Find luxury properties tailored to your personal routine, commute, and comfort.
      </p>
      <button 
        className="luxury-btn pulse-glow" 
        onClick={onStart}
        style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}
      >
        Try the App
      </button>
    </div>
  );
}
