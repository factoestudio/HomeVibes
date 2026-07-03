import React from 'react';
import './App.css';

export default function RoleSelector({ onSelectRole }) {
  return (
    <div className="role-selector-wrapper fade-in">
      <div className="role-selector-header">
        <h1>Welcome to HomeVibes</h1>
        <p>What brings you to our platform today?</p>
      </div>
      
      <div className="role-selector-cards">
        <div 
          className="role-card luxury-border glass-panel"
          onClick={() => onSelectRole('resident')}
        >
          <div className="role-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <h2>I'm looking for a home</h2>
          <p>Find a neighborhood and home that perfectly matches your lifestyle, commute, and daily routines.</p>
          <button className="btn-primary role-btn">Find My Vibe &rarr;</button>
        </div>

        <div 
          className="role-card luxury-border glass-panel"
          onClick={() => onSelectRole('investor')}
        >
          <div className="role-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <h2>I'm an investor</h2>
          <p>Discover high-potential neighborhoods and uncover market insights based on lifestyle demand data.</p>
          <button className="btn-primary role-btn">Explore Investments &rarr;</button>
        </div>
      </div>
    </div>
  );
}
