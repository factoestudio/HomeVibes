import React, { useState } from 'react';
import {
  StudentIcon,
  ProfessionalIcon,
  FamilyIcon,
  SeniorIcon,
  WalkingIcon,
  TransitIcon,
  DrivingIcon,
  CafesIcon,
  MallsIcon,
  NatureIcon,
  LibraryIcon,
  PremiumGroceriesIcon,
  BudgetGroceriesIcon,
  DogParksIcon,
  RentIcon,
  BuyIcon,
  CityIcon,
  BuildingIcon,
  WavesIcon,
  CodeIcon,
  TownhouseIcon
} from './SvgIcons';

const PROFILES = [
  { id: 'student', name: 'Student & Academic', icon: <StudentIcon size={32} />, desc: 'Prioritize transit proximity to campuses, libraries, study hubs, and affordable living.' },
  { id: 'professional', name: 'Single Professional', icon: <ProfessionalIcon size={32} />, desc: 'Prioritize nightlife, dining options, gyms, co-working spaces, and city density.' },
  { id: 'family', name: 'Growing Family', icon: <FamilyIcon size={32} />, desc: 'Prioritize high-ranked schools, playgrounds, daycares, safety, and suburban greenery.' },
  { id: 'senior', name: 'Downsizer & Senior', icon: <SeniorIcon size={32} />, desc: 'Prioritize peaceful streets, medical access, local parks, and low maintenance.' }
];

const HUBS = [
  { id: 'downtown', name: 'Downtown Toronto Core', icon: <CityIcon size={32} /> },
  { id: 'north-york', name: 'North York / Willowdale', icon: <BuildingIcon size={32} /> },
  { id: 'mississauga', name: 'Mississauga City Centre', icon: <WavesIcon size={32} /> },
  { id: 'markham', name: 'Markham Tech District', icon: <CodeIcon size={32} /> }
];

const TRANSIT_MODES = [
  { id: 'walking', name: 'Walking & Cycling', desc: 'Prioritize active walking paths, trails, and hyper-local errand access.', icon: <WalkingIcon size={24} /> },
  { id: 'transit', name: 'Public Transit', desc: 'GO Trains, TTC subway/streetcars, and local express bus lines.', icon: <TransitIcon size={24} /> },
  { id: 'driving', name: 'Driving', desc: 'Highway connectivity (DVP, 401, QEW), easy parking, and low local gridlock.', icon: <DrivingIcon size={24} /> }
];

const AMENITY_PILLARS = [
  { id: 'cafes_restaurants', name: 'Cafes & Dining', desc: 'Artisanal coffee, brunch spots, and gourmet restaurants.', icon: <CafesIcon size={20} /> },
  { id: 'malls_shopping', name: 'Malls & Retail', desc: 'Major shopping centers, local boutiques, and retail corridors.', icon: <MallsIcon size={20} /> },
  { id: 'parks_nature', name: 'Parks & Nature', desc: 'Lakeside access, beach walks, ravines, and hiking trails.', icon: <NatureIcon size={20} /> },
  { id: 'libraries_civic', name: 'Libraries & Community', desc: 'Public libraries, community centers, and recreation programs.', icon: <LibraryIcon size={20} /> },
  { id: 'premium_groceries', name: 'Specialty & Organic Groceries', desc: 'Whole Foods, local organic markets, and premium foods.', icon: <PremiumGroceriesIcon size={20} /> },
  { id: 'budget_groceries', name: 'Affordable Groceries', desc: 'Proximity to discount supermarkets (NoFrills, FreshCo).', icon: <BudgetGroceriesIcon size={20} /> },
  { id: 'dog_parks', name: 'Dog Parks & Pet Vibe', desc: 'Fenced off-leash areas, walking trails, and pet-friendly cafes.', icon: <DogParksIcon size={20} /> }
];

const PROPERTY_TYPES = [
  { id: 'Condo', name: 'Condo Suite', icon: <BuildingIcon size={20} /> },
  { id: 'House', name: 'Detached / Semi', icon: <BuyIcon size={20} /> },
  { id: 'Townhouse', name: 'Townhome', icon: <TownhouseIcon size={20} /> },
  { id: 'Loft', name: 'Soft/Hard Loft', icon: <WavesIcon size={20} /> }
];

const PRICE_PRESETS = {
  rent: [1800, 2200, 2600, 3200, 4500],
  buy: [600000, 850000, 1100000, 1500000, 2500000]
};

export default function VibeQuiz({ onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState('professional');
  const [hub, setHub] = useState('downtown');
  const [commuteFrequency, setCommuteFrequency] = useState('daily');
  const [transitMode, setTransitMode] = useState('transit');

  // Initialize all 7 lifestyle pillars with level 1 (Nice-to-have)
  const [lifestyle, setLifestyle] = useState({
    cafes_restaurants: 1,
    malls_shopping: 1,
    parks_nature: 1,
    libraries_civic: 1,
    premium_groceries: 1,
    budget_groceries: 1,
    dog_parks: 1
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleLifestyleChange = (id, value) => {
    setLifestyle(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = () => {
    onComplete({
      profile,
      hub,
      commuteFrequency,
      transitMode,
      lifestyle
    });
  };

  const progressPercent = ((step - 1) / 4) * 100;

  return (
    <div className="quiz-container card-glass luxury-border">
      {/* Premium Progress Bar */}
      <div className="quiz-progress-bar-bg">
        <div 
          className="quiz-progress-bar-fill gold-gradient-bg" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <div className="quiz-steps-counter uppercase">
        Step {step} of 4
      </div>

      {/* STEP 1: DEMOGRAPHIC PROFILE */}
      {step === 1 && (
        <div className="quiz-step-content fade-in">
          <h2 className="quiz-title display-font gold-text-glow">Select Your Profile</h2>
          <p className="quiz-subtitle">Choose the lifestyle category that matches your current life stage.</p>
          
          <div className="quiz-options-list">
            {PROFILES.map(item => (
              <div 
                key={item.id}
                className={`quiz-list-item luxury-item ${profile === item.id ? 'active' : ''}`}
                onClick={() => setProfile(item.id)}
              >
                <div className="quiz-list-item-icon gold-text">{item.icon}</div>
                <div className="quiz-list-item-info">
                  <div className="quiz-list-item-name">{item.name}</div>
                  <div className="quiz-list-item-desc">{item.desc}</div>
                </div>
                <div className="quiz-list-item-radio">
                  <div className="radio-circle"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="quiz-nav-actions">
            <div></div>
            <button className="btn-primary btn-gold" onClick={nextStep}>
              Next: Commute Hub &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: COMMUTE HUB & FREQUENCY */}
      {step === 2 && (
        <div className="quiz-step-content fade-in">
          <h2 className="quiz-title display-font gold-text-glow">Frequent Commute Place</h2>
          <p className="quiz-subtitle">We will measure commute times to find areas with the easiest connectivity.</p>
          
          <div className="quiz-options-grid">
            {HUBS.map(item => (
              <div 
                key={item.id}
                className={`quiz-card luxury-card ${hub === item.id ? 'active' : ''}`}
                onClick={() => setHub(item.id)}
              >
                <div className="quiz-card-icon">{item.icon}</div>
                <div className="quiz-card-name">{item.name}</div>
              </div>
            ))}
          </div>

          <div className="quiz-form-group">
            <label className="quiz-label uppercase letter-spacing">How often do you travel there?</label>
            <div className="quiz-toggle-group">
              {[
                { id: 'daily', label: 'Daily (5+ times/wk)' },
                { id: 'frequent', label: 'A few times/wk (2-4)' },
                { id: 'occasional', label: 'Weekly / Hybrid' },
                { id: 'remote', label: 'Remote Work / Never' }
              ].map(freq => (
                <button
                  key={freq.id}
                  type="button"
                  className={`quiz-toggle-btn luxury-btn ${commuteFrequency === freq.id ? 'active' : ''}`}
                  onClick={() => setCommuteFrequency(freq.id)}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-nav-actions">
            <button className="btn-secondary" onClick={prevStep}>
              &larr; Back
            </button>
            <button className="btn-primary btn-gold" onClick={nextStep}>
              Next: Commute Mode &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TRANSIT MODE PREFERENCE */}
      {step === 3 && (
        <div className="quiz-step-content fade-in">
          <h2 className="quiz-title display-font gold-text-glow">Preferred Transit Mode</h2>
          <p className="quiz-subtitle">How do you prefer getting around the city?</p>

          <div className="quiz-options-list">
            {TRANSIT_MODES.map(mode => (
              <div 
                key={mode.id}
                className={`quiz-list-item luxury-item ${transitMode === mode.id ? 'active' : ''}`}
                onClick={() => setTransitMode(mode.id)}
              >
                <div className="quiz-list-item-icon gold-text">{mode.icon}</div>
                <div className="quiz-list-item-info">
                  <div className="quiz-list-item-name">{mode.name}</div>
                  <div className="quiz-list-item-desc">{mode.desc}</div>
                </div>
                <div className="quiz-list-item-radio">
                  <div className="radio-circle"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="quiz-nav-actions">
            <button className="btn-secondary" onClick={prevStep}>
              &larr; Back
            </button>
            <button className="btn-primary btn-gold" onClick={nextStep}>
              Next: Amenities & Vibes &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DETAILED AMENITIES & LIFESTYLE */}
      {step === 4 && (
        <div className="quiz-step-content fade-in">
          <h2 className="quiz-title display-font gold-text-glow">Lifestyle & Conveniences</h2>
          <p className="quiz-subtitle">Select how important each surrounding amenity is to your daily life.</p>

          <div className="lifestyle-priority-list luxury-scroll">
            {AMENITY_PILLARS.map(pillar => (
              <div key={pillar.id} className="lifestyle-priority-item card-subglass luxury-subcard">
                <div className="priority-item-header">
                  <span className="priority-icon gold-text">{pillar.icon}</span>
                  <div className="priority-info">
                    <span className="priority-name">{pillar.name}</span>
                    <p className="priority-desc">{pillar.desc}</p>
                  </div>
                </div>
                <div className="priority-selector">
                  {[
                    { val: 0, label: 'Not Important', class: 'level-low' },
                    { val: 1, label: 'Nice to Have', class: 'level-med' },
                    { val: 2, label: 'Must-Have', class: 'level-high' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      className={`priority-btn ${opt.class} ${lifestyle[pillar.id] === opt.val ? 'active' : ''}`}
                      onClick={() => handleLifestyleChange(pillar.id, opt.val)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="quiz-nav-actions">
            <button className="btn-secondary" onClick={prevStep}>
              &larr; Back
            </button>
          <div className="quiz-nav-actions">
            <button className="btn-secondary" onClick={prevStep}>
              &larr; Back
            </button>
            <button className="btn-success btn-gold-success" onClick={handleSubmit}>
              Calculate Matches &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
