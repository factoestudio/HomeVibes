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



export default function VibeQuiz({ onComplete, userRole }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState('professional');
  const [commuteLocations, setCommuteLocations] = useState([{ id: 1, address: '' }]);
  const [commuteFrequency, setCommuteFrequency] = useState('daily');
  const [transitMode, setTransitMode] = useState('transit');
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Investor States
  const [invGoal, setInvGoal] = useState('rental');
  const [invTenant, setInvTenant] = useState('professional');
  const [invBudget, setInvBudget] = useState('500k-1m');

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
    if (userRole === 'investor') {
      onComplete({
        userRole,
        invGoal,
        invTenant,
        invBudget
      });
      return;
    }

    // If remote or no addresses, skip geocoding
    if (commuteFrequency === 'remote') {
      onComplete({
        profile,
        commuteLocations: [],
        commuteFrequency,
        transitMode,
        lifestyle
      });
      return;
    }

    setIsGeocoding(true);
    
    // Geocode all valid addresses via OpenStreetMap Nominatim
    const locationsWithCoords = await Promise.all(
      commuteLocations.filter(loc => loc.address.trim() !== '').map(async (loc) => {
        try {
          // OpenStreetMap requires a user-agent, but fetch API works well enough for testing.
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(loc.address)}&limit=1`);
          const data = await res.json();
          if (data && data.length > 0) {
            return {
              ...loc,
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon)
            };
          }
        } catch (e) {
          console.error("Geocoding failed for", loc.address);
        }
        return loc; // Fallback without coords
      })
    );

    setIsGeocoding(false);

    onComplete({
      profile,
      commuteLocations: locationsWithCoords,
      commuteFrequency,
      transitMode,
      lifestyle
    });
  };

  const totalSteps = 4;
  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="quiz-container card-glass luxury-border">
      {/* Premium Progress Bar - only show for resident path */}
      {userRole !== 'investor' && (
        <>
          <div className="quiz-progress-bar-bg">
            <div 
              className="quiz-progress-bar-fill platinum-gradient-bg" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="quiz-steps-counter uppercase">
            Step {step} of {totalSteps}
          </div>
        </>
      )}
      
      <div className="quiz-container-inner">
      {userRole === 'investor' ? (
        <div className="quiz-step-content fade-in">
          <h2 className="quiz-title display-font platinum-text-glow">Investor Profile</h2>
          <p className="quiz-subtitle">Configure your investment targets below.</p>
          
          <div className="quiz-form-group" style={{ marginBottom: '2rem' }}>
            <label className="quiz-label uppercase letter-spacing">1. Primary Investment Goal</label>
            <div className="quiz-toggle-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'rental', label: 'High-Yield Rental Income' },
                { id: 'appreciation', label: 'Long-Term Appreciation' },
                { id: 'flip', label: 'Pre-Construction / Flipping' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={`quiz-toggle-btn luxury-btn ${invGoal === opt.id ? 'active' : ''}`}
                  onClick={() => setInvGoal(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-form-group" style={{ marginBottom: '2rem' }}>
            <label className="quiz-label uppercase letter-spacing">2. Target Tenant Profile</label>
            <div className="quiz-toggle-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'professional', label: 'Young Professionals (Downtown/Transit)' },
                { id: 'student', label: 'University Students (Campuses)' },
                { id: 'family', label: 'Families (Schools/Parks)' },
                { id: 'luxury', label: 'Luxury Corporate (Yorkville/King West)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={`quiz-toggle-btn luxury-btn ${invTenant === opt.id ? 'active' : ''}`}
                  onClick={() => setInvTenant(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-form-group" style={{ marginBottom: '2rem' }}>
            <label className="quiz-label uppercase letter-spacing">3. Target Budget</label>
            <div className="quiz-toggle-group">
              {[
                { id: 'under500', label: 'Under $500k' },
                { id: '500k-1m', label: '$500k - $1M' },
                { id: 'over1m', label: '$1M+' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={`quiz-toggle-btn luxury-btn ${invBudget === opt.id ? 'active' : ''}`}
                  onClick={() => setInvBudget(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-nav-actions" style={{ marginTop: '2rem' }}>
            <div></div>
            <button className="btn-success btn-platinum-success" onClick={handleSubmit}>
              Calculate Market Matches &rarr;
            </button>
          </div>
        </div>
      ) : (
        <>
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
          <h2 className="quiz-title display-font platinum-text-glow">Frequent Destinations</h2>
          <p className="quiz-subtitle">Enter the addresses you travel to most often (e.g., Work, Daycare, Gym).</p>
          
          <div className="commute-locations-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {commuteLocations.map((loc, index) => (
              <div key={loc.id} style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="luxury-input" 
                  placeholder="E.g., 100 King St W, Toronto"
                  value={loc.address}
                  onChange={(e) => {
                    const newLocs = [...commuteLocations];
                    newLocs[index].address = e.target.value;
                    setCommuteLocations(newLocs);
                  }}
                  style={{ flex: 1 }}
                />
                {commuteLocations.length > 1 && (
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      setCommuteLocations(commuteLocations.filter(l => l.id !== loc.id));
                    }}
                    style={{ padding: '0 1rem' }}
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button"
              className="btn-secondary"
              style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              onClick={() => {
                setCommuteLocations([...commuteLocations, { id: Date.now(), address: '' }]);
              }}
            >
              + Add another destination
            </button>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Want to save these locations? <span style={{ color: 'var(--color-primary)', textDecoration: 'underline', cursor: 'pointer' }}>Create an account</span> to securely store your progress.
            </p>
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
            <button className="btn-primary btn-platinum" onClick={nextStep}>
              Next: Commute Mode &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TRANSIT MODE PREFERENCE */}
      {step === 3 && (
        <div className="quiz-step-content fade-in">
          <h2 className="quiz-title display-font platinum-text-glow">Preferred Transit Mode</h2>
          <p className="quiz-subtitle">How do you prefer getting around the city?</p>

          <div className="quiz-options-list">
            {TRANSIT_MODES.map(mode => (
              <div 
                key={mode.id}
                className={`quiz-list-item luxury-item ${transitMode === mode.id ? 'active' : ''}`}
                onClick={() => setTransitMode(mode.id)}
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
      </>
      )}
      </div>
    </div>
  );
}
