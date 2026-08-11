import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../App.css';

export default function ContactB2B({ setView, navigateTo }) {
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    email: '',
    interest: 'lead_membership',
    submitted: false,
    isSubmitting: false,
    errorMessage: null
  });

  const handleBack = () => {
    if (typeof navigateTo === 'function') navigateTo('/');
    else if (typeof setView === 'function') setView('quiz');
    else window.location.href = '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, isSubmitting: true, errorMessage: null }));

    try {
      const { error } = await supabase.from('contact_leads').insert([{
        full_name: formState.name,
        company: formState.company,
        email: formState.email,
        interest: formState.interest,
        source: 'b2b_contact_form',
        created_at: new Date().toISOString()
      }]);

      if (error) {
        console.warn('Supabase lead submission warning:', error.message);
      }
      setFormState(prev => ({ ...prev, submitted: true }));
    } catch (err) {
      console.error('B2B submission error:', err.message);
      setFormState(prev => ({ ...prev, submitted: true }));
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="b2b-page-wrapper">
      <div className="b2b-page-container glass-panel luxury-border">
        <button className="back-btn" onClick={handleBack}>
          &larr; Back to Home
        </button>
        
        <div className="b2b-header">
          <h1 className="b2b-title">Partner With HomeVibes</h1>
          <p className="b2b-subtitle">
            Get highly-qualified, lifestyle-matched real estate leads delivered directly to your inbox.
          </p>
        </div>

        <div className="b2b-content">
          <div className="b2b-value-prop">
            <h3>Why Partner With Us?</h3>
            <ul>
              <li><strong>Hyper-Qualified Leads:</strong> We match buyers/renters to neighborhoods based on 20+ lifestyle variables.</li>
              <li><strong>High Conversion:</strong> Connect with clients who already know exactly where they want to live.</li>
              <li><strong>Market Intelligence:</strong> Gain exclusive access to spatial demand data and ROI dashboards.</li>
            </ul>
          </div>

          <div className="b2b-form-container">
            {formState.submitted ? (
              <div className="success-message">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3>Request Received</h3>
                <p>Our partnership team will be in touch with you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="b2b-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="luxury-input"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  />
                </div>
                
                <div className="form-group">
                  <label>Agency / Company Name</label>
                  <input 
                    type="text" 
                    required 
                    className="luxury-input"
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Professional Email</label>
                  <input 
                    type="email" 
                    required 
                    className="luxury-input"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Area of Interest</label>
                  <select 
                    className="luxury-input"
                    value={formState.interest}
                    onChange={(e) => setFormState({ ...formState, interest: e.target.value })}
                  >
                    <option value="lead_membership">Realtor Lead Network Membership</option>
                    <option value="developer_data">Developer Neighborhood Analytics API</option>
                    <option value="custom_partnership">Custom Marketing & Branding Partnership</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn-luxury btn-full"
                  disabled={formState.isSubmitting}
                >
                  {formState.isSubmitting ? 'Submitting Application...' : 'Request Partner Access'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="contact-alternative" style={{textAlign: 'center', marginTop: '2rem'}}>
          <p style={{color: 'var(--text-muted)'}}>Or email us directly at: <a href="mailto:info@homevibes.app" style={{color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none'}}>info@homevibes.app</a></p>
        </div>
      </div>
    </div>
  );
}
