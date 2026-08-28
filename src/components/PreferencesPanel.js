import React, { useState } from 'react';

const AMENITY_PILLARS = [
  { id: 'cafes_restaurants', name: 'Cafes & Dining' },
  { id: 'malls_shopping', name: 'Malls & Retail' },
  { id: 'parks_nature', name: 'Parks & Nature' },
  { id: 'libraries_civic', name: 'Libraries & Civic' },
  { id: 'premium_groceries', name: 'Premium Groceries' },
  { id: 'budget_groceries', name: 'Budget Groceries' },
  { id: 'dog_parks', name: 'Dog Parks' }
];

export default function PreferencesPanel({ currentPreferences, onSave, onClose }) {
  const [profile, setProfile] = useState(currentPreferences?.profile || 'professional');
  const [transitMode, setTransitMode] = useState(currentPreferences?.transitMode || 'transit');
  const [isRemote, setIsRemote] = useState(currentPreferences?.isRemote || false);
  const [lifestyle, setLifestyle] = useState(currentPreferences?.lifestyle || {});

  const handleLifestyleChange = (id, value) => {
    setLifestyle(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSave = () => {
    onSave({
      ...currentPreferences,
      profile,
      transitMode,
      isRemote,
      lifestyle
    });
  };

  return (
    <div className="card-subglass luxury-subcard animate-fade-in" style={{ padding: '1.25rem', marginBottom: '1rem', border: '1px solid var(--border-glow)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 className="display-font" style={{ margin: 0 }}>⚙️ Refine Preferences</h4>
        <button onClick={onClose} className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Close</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="quiz-label uppercase letter-spacing" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>Profile</label>
          <select 
            className="luxury-input" 
            value={profile} 
            onChange={(e) => setProfile(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '8px' }}
          >
            <option value="student">Student & Academic</option>
            <option value="professional">Single Professional</option>
            <option value="family">Growing Family</option>
            <option value="senior">Downsizer & Senior</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="quiz-label uppercase letter-spacing" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>Transit Mode</label>
          <select 
            className="luxury-input" 
            value={transitMode} 
            onChange={(e) => setTransitMode(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '8px' }}
          >
            <option value="walking">Walking & Cycling</option>
            <option value="transit">Public Transit</option>
            <option value="driving">Driving</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button 
          type="button"
          className={`quiz-toggle-btn luxury-btn ${isRemote ? 'active' : ''}`}
          onClick={() => setIsRemote(!isRemote)}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          {isRemote ? '🏠 Remote Worker (Active)' : '🏢 Commuter (Click to set Remote)'}
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label className="quiz-label uppercase letter-spacing" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>Lifestyle Priorities</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {AMENITY_PILLARS.map(pillar => (
            <div key={pillar.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{pillar.name}</span>
              <div className="priority-selector" style={{ display: 'flex', gap: '0.25rem' }}>
                {[
                  { val: 0, label: 'Low', class: 'level-low' },
                  { val: 1, label: 'Med', class: 'level-med' },
                  { val: 2, label: 'High', class: 'level-high' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    className={`priority-btn ${opt.class} ${lifestyle[pillar.id] === opt.val ? 'active' : ''}`}
                    onClick={() => handleLifestyleChange(pillar.id, opt.val)}
                    style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem', textAlign: 'center' }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primary btn-platinum" style={{ width: '100%', padding: '0.75rem' }} onClick={handleSave}>
        Apply Preferences
      </button>
    </div>
  );
}
