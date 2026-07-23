import React, { useState } from 'react';
import '../App.css';

export default function ContactB2B({ setView }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    interest: 'lead_membership'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally we would send this to a backend or CRM here.
    console.log("B2B Lead Captured:", formData);
    setSubmitted(true);
  };

  return (
    <div className="b2b-page-wrapper">
      <div className="b2b-page-container glass-panel luxury-border">
        <button className="back-btn" onClick={() => setView('quiz')}>
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
            {submitted ? (
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
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Agency / Company Name</label>
                  <input 
                    type="text" 
                    required 
                    className="luxury-input"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Professional Email</label>
                  <input 
                    type="email" 
                    required 
                    className="luxury-input"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Area of Interest</label>
                  <select 
                    className="luxury-input"
                    value={formData.interest}
                    onChange={(e) => setFormData({...formData, interest: e.target.value})}
                  >
                    <option value="lead_membership">Pay-per-Lead Membership</option>
                    <option value="data_licensing">Data & Insights Licensing</option>
                    <option value="developer_tools">Enterprise Developer Tools</option>
                    <option value="demo">Request a Demo</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary b2b-submit-btn">
                  Request Partnership Details
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
