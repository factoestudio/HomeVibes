import React from 'react';
import '../App.css';

export default function Footer({ setView }) {
  return (
    <footer className="footer-container glass-panel luxury-border">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>HomeVibes</h3>
          <p>Where your vibes meet home</p>
        </div>
        
        <div className="footer-links">
          <button 
            className="footer-link-btn" 
            onClick={() => { setView('privacy'); window.scrollTo(0,0); }}
          >
            Data Privacy & Treatment
          </button>
          <span className="footer-divider">|</span>
          <button 
            className="footer-link-btn" 
            onClick={() => { setView('blog'); window.scrollTo(0,0); }}
          >
            Blog
          </button>
          <span className="footer-divider">|</span>
          <button 
            className="footer-link-btn highlight-link" 
            onClick={() => { setView('contact'); window.scrollTo(0,0); }}
          >
            Partner With Us (B2B)
          </button>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} HomeVibes. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
