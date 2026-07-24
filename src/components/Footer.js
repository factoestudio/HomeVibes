import React from 'react';
import '../App.css';

export default function Footer({ setView, navigateTo }) {
  const handleNav = (path, viewName) => {
    if (navigateTo) {
      navigateTo(path);
    } else if (setView) {
      setView(viewName);
    }
    window.scrollTo(0, 0);
  };

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
            onClick={() => handleNav('/privacy', 'privacy')}
          >
            Data Privacy & Treatment
          </button>
          <span className="footer-divider">|</span>
          <button 
            className="footer-link-btn" 
            onClick={() => handleNav('/insights', 'blog')}
          >
            Blog
          </button>
          <span className="footer-divider">|</span>
          <button 
            className="footer-link-btn highlight-link" 
            onClick={() => handleNav('/contact', 'contact')}
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
