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
  DogParksIcon
} from './SvgIcons';

const PROFILES = [
  { id: 'student', name: 'Student & Academic', icon: <StudentIcon size={32} />, desc: 'Prioritize transit proximity to campuses, libraries, study hubs, and affordable living.' },
  { id: 'professional', name: 'Single Professional', icon: <ProfessionalIcon size={32} />, desc: 'Prioritize nightlife, dining options, gyms, co-working spaces, and city density.' },
  { id: 'family', name: 'Growing Family', icon: <FamilyIcon size={32} />, desc: 'Prioritize high-ranked schools, playgrounds, daycares, safety, and suburban greenery.' },
  { id: 'senior', name: 'Downsizer & Senior', icon: <SeniorIcon size={32} />, desc: 'Prioritize peaceful streets, medical access, local parks, and low maintenance.' }
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



export default function VibeQuiz({ onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState('professional');
  const [commuteLocations, setCommuteLocations] = useState([{ id: 1, address: '', label: 'Work', frequency: 'daily' }]);
  const [isRemote, setIsRemote] = useState(false);
  const [transitMode, setTransitMode] = useState('transit');
  const [tenure, setTenure] = useState('rent');
  const [maxPrice, setMaxPrice] = useState(2500);
  const [isGeocoding, setIsGeocoding] = useState(false);

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

  const handleSubmit = async () => {
    // If remote or no addresses, skip geocoding
    if (isRemote || commuteLocations.length === 0 || commuteLocations.every(loc => loc.address.trim() === '')) {
      onComplete({
        profile,
        commuteLocations: [],
        isRemote,
        transitMode,
        tenure,
        maxPrice,
        lifestyle
      });
      return;
    }

    setIsGeocoding(true);
    
    // Geocode all valid addresses via OpenStreetMap Nominatim
    const locationsWithCoords = await Promise.all(
      commuteLocations.filter(loc => loc.address.trim() !== '').map(async (loc) => {
        try {
          const searchQuery = /ontario|gta|toronto|mississauga|brampton|oakville|markham|vaughan/i.test(loc.address) 
            ? loc.address 
            : `${loc.address}, Greater Toronto Area, Ontario, Canada`;

          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`, {
            headers: { 'User-Agent': 'HomeVibesApp/1.0' }
          });
          if (!res.ok) throw new Error("Geocoding HTTP Error");
          const data = await res.json();
          if (data && data.length > 0) {
            return {
              ...loc,
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon)
            };
          }
        } catch (e) {
          console.error("Geocoding failed for", loc.address, e);
        }
        // Fallback to Toronto center
        return { ...loc, lat: 43.6532, lng: -79.3832 }; 
      })
    );

    setIsGeocoding(false);

    onComplete({
      profile,
      commuteLocations: locationsWithCoords,
      isRemote,
      transitMode,
      tenure,
      maxPrice,
      lifestyle
    });
  };

  const totalSteps = 4;
  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="quiz-container card-glass luxury-border">
      <div className="quiz-progress-bar-bg">
        <div 
          className="quiz-progress-bar-fill platinum-gradient-bg" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <div className="quiz-steps-counter uppercase">
        Step {step} of {totalSteps}
      </div>
      
      <div className="quiz-container-inner">
      {/* STEP 1: DEMOGRAPHIC PROFILE */}
      {step === 1 && (
        <div className="quiz-step-content fade-in">
          <h2 className="quiz-title display-font platinum-text-glow">Select Your Profile</h2>
          <p className="quiz-subtitle">Choose the lifestyle category that matches your current life stage.</p>
          
          <div className="quiz-options-list">
            {PROFILES.map(item => (
              <div 
                key={item.id}
                className={`quiz-list-item luxury-item ${profile === item.id ? 'active' : ''}`}
                onClick={() => setProfile(item.id)}
                role="radio"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setProfile(item.id); } }}
                aria-checked={profile === item.id}
              >
                <div className="quiz-list-item-icon platinum-text">{item.icon}</div>
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
            <button className="btn-primary btn-platinum" onClick={nextStep}>
              Next: Commute Hub &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: COMMUTE DESTINATIONS & FREQUENCY */}
      {step === 2 && (
        <div className="quiz-step-content fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 className="quiz-title display-font platinum-text-glow">Anchor Locations</h2>
              <p className="quiz-subtitle">Enter your frequent destinations (e.g., Office, Gym, Partner's Place).</p>
            </div>
            <button 
              type="button"
              className={`quiz-toggle-btn luxury-btn ${isRemote ? 'active' : ''}`}
              onClick={() => setIsRemote(!isRemote)}
              style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}
            >
              🏠 I Work Remotely
            </button>
          </div>
          
          {!isRemote && (
            <div className="commute-locations-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem', marginTop: '1rem' }}>
              {commuteLocations.map((loc, index) => (
                <div key={loc.id} className="card-subglass luxury-subcard" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="quiz-label uppercase letter-spacing">Location {index + 1}</label>
                    {commuteLocations.length > 1 && (
                      <button 
                        type="button" 
                        className="btn-secondary"
                        onClick={() => setCommuteLocations(commuteLocations.filter(l => l.id !== loc.id))}
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input 
                      type="text" 
                      className="luxury-input" 
                      placeholder="Label (e.g. Work, Gym)"
                      value={loc.label}
                      onChange={(e) => {
                        const newLocs = [...commuteLocations];
                        newLocs[index].label = e.target.value;
                        setCommuteLocations(newLocs);
                      }}
                      style={{ flex: 1, minWidth: '150px' }}
                    />
                    <input 
                      type="text" 
                      className="luxury-input" 
                      placeholder="Address (e.g. 100 King St W)"
                      value={loc.address}
                      onChange={(e) => {
                        const newLocs = [...commuteLocations];
                        newLocs[index].address = e.target.value;
                        setCommuteLocations(newLocs);
                      }}
                      style={{ flex: 2, minWidth: '250px' }}
                    />
                  </div>
                  <div className="quiz-toggle-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {[
                      { id: 'daily', label: 'Daily (5+)' },
                      { id: 'frequent', label: 'Few times (2-4)' },
                      { id: 'occasional', label: 'Weekly (1)' }
                    ].map(freq => (
                      <button
                        key={freq.id}
                        type="button"
                        className={`quiz-toggle-btn luxury-btn ${loc.frequency === freq.id ? 'active' : ''}`}
                        onClick={() => {
                          const newLocs = [...commuteLocations];
                          newLocs[index].frequency = freq.id;
                          setCommuteLocations(newLocs);
                        }}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', flex: 1 }}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button 
                type="button"
                className="btn-secondary"
                style={{ alignSelf: 'flex-start', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                onClick={() => {
                  setCommuteLocations([...commuteLocations, { id: Date.now(), address: '', label: '', frequency: 'frequent' }]);
                }}
              >
                + Add another destination
              </button>
            </div>
          )}

          <div className="quiz-nav-actions" style={{ marginTop: isRemote ? '3rem' : '1rem' }}>
            <button className="btn-secondary" onClick={prevStep}>
              &larr; Back
            </button>
            <button 
              className="btn-primary btn-platinum" 
              onClick={nextStep}
              disabled={!isRemote && !commuteLocations.some(loc => loc.address.trim() !== '')}
              title={!isRemote && !commuteLocations.some(loc => loc.address.trim() !== '') ? "Please enter at least one address" : ""}
            >
              Next: Commute Mode &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TRANSIT MODE & BUDGET ALIGNMENT */}
      {step === 3 && (
        <div className="quiz-step-content fade-in">
          <h2 className="quiz-title display-font platinum-text-glow">Transit & Housing Budget</h2>
          <p className="quiz-subtitle">Set your preferred transport mode and target monthly/purchase budget.</p>

          {/* Transit Mode Selection */}
          <label className="quiz-label uppercase letter-spacing" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.82rem' }}>1. Transport Mode</label>
          <div className="quiz-options-list" style={{ marginBottom: '1.5rem' }}>
            {TRANSIT_MODES.map(mode => (
              <div 
                key={mode.id}
                className={`quiz-list-item luxury-item ${transitMode === mode.id ? 'active' : ''}`}
                onClick={() => setTransitMode(mode.id)}
                role="radio"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTransitMode(mode.id); } }}
                aria-checked={transitMode === mode.id}
              >
                <div className="quiz-list-item-icon platinum-text">{mode.icon}</div>
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

          {/* Housing Tenure & Budget Selector */}
          <div className="card-subglass luxury-subcard" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <label className="quiz-label uppercase letter-spacing" style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.82rem' }}>2. Housing Intent & Target Budget</label>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className={`quiz-toggle-btn luxury-btn ${tenure === 'rent' ? 'active' : ''}`}
                onClick={() => { setTenure('rent'); setMaxPrice(2500); }}
                style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem' }}
              >
                🔑 Renting (Monthly)
              </button>
              <button
                type="button"
                className={`quiz-toggle-btn luxury-btn ${tenure === 'buy' ? 'active' : ''}`}
                onClick={() => { setTenure('buy'); setMaxPrice(900000); }}
                style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem' }}
              >
                🏡 Buying (Purchase Price)
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Budget Limit:</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                {tenure === 'rent' ? `$${maxPrice.toLocaleString()}/mo` : `$${(maxPrice / 1000).toLocaleString()}k`}
              </span>
            </div>

            <input 
              type="range"
              min={tenure === 'rent' ? 1200 : 400000}
              max={tenure === 'rent' ? 5000 : 2500000}
              step={tenure === 'rent' ? 100 : 25000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer', marginBottom: '0.75rem' }}
            />

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(tenure === 'rent' 
                ? [1800, 2400, 3000, 3800]
                : [650000, 850000, 1200000, 1600000]
              ).map(preset => (
                <button
                  key={preset}
                  type="button"
                  className="btn-secondary"
                  onClick={() => setMaxPrice(preset)}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', flex: 1 }}
                >
                  {tenure === 'rent' ? `$${preset}/mo` : `$${preset / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-nav-actions">
            <button className="btn-secondary" onClick={prevStep}>
              &larr; Back
            </button>
            <button className="btn-primary btn-platinum" onClick={nextStep}>
              Next: Amenities & Vibes &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DETAILED AMENITIES & LIFESTYLE */}
      {step === 4 && (
        <div className="quiz-step-content fade-in">
          <h2 className="quiz-title display-font platinum-text-glow">Lifestyle & Conveniences</h2>
          <p className="quiz-subtitle">Select how important each surrounding amenity is to your daily life.</p>

          <div className="lifestyle-priority-list luxury-scroll">
            {AMENITY_PILLARS.map(pillar => (
              <div key={pillar.id} className="lifestyle-priority-item card-subglass luxury-subcard">
                <div className="priority-item-header">
                  <span className="priority-icon platinum-text">{pillar.icon}</span>
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
            <button className="btn-success btn-platinum-success" onClick={handleSubmit} disabled={isGeocoding}>
              {isGeocoding ? 'Calculating Routes...' : 'Calculate Matches →'}
            </button>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
