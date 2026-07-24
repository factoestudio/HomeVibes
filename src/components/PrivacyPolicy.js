import React from 'react';
import '../App.css';

export default function PrivacyPolicy({ setView, navigateTo }) {
  const handleBack = () => {
    if (navigateTo) navigateTo('/');
    else if (setView) setView('quiz');
  };

  return (
    <div className="legal-page-wrapper">
      <div className="legal-page-container glass-panel luxury-border">
        <button className="back-btn" onClick={handleBack}>
          &larr; Back to Home
        </button>
        
        <h1 className="legal-title">Privacy Policy & Data Treatment</h1>
        <p className="legal-date">Last Updated: July 2026</p>

        <div className="legal-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to HomeVibes ("we", "our", "us"). We respect your privacy and are committed to protecting your personal data in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable Ontario provincial laws.
            </p>
            <p>
              HomeVibes operates as a "Middle Layer" and Lead Generation service. Our platform connects individuals seeking lifestyle-matched real estate with licensed real estate professionals and developers.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We collect the following types of personal information when you use our platform:</p>
            <ul>
              <li><strong>Contact Information:</strong> Name, email address, and phone number (collected via our Lead Capture gateway).</li>
              <li><strong>Lifestyle Data:</strong> Daily routines, commute preferences, neighborhood preferences, and hobbies inputted during the Vibe Quiz.</li>
              <li><strong>Usage Data:</strong> Anonymized interaction data (IP address, browser type, pages visited) to improve our AI matching engine.</li>
            </ul>
          </section>

          <section>
            <h2>3. Purpose of Collection</h2>
            <p>Your personal information is collected for the following primary purposes:</p>
            <ul>
              <li>To algorithmically match your lifestyle profile with compatible Toronto (GTA) neighborhoods.</li>
              <li><strong>Lead Generation:</strong> To connect you with our vetted B2B partners (real estate agents, brokers, and developers) who can assist you in finding available properties in your matched areas. By submitting your contact information, you expressly consent to this introduction.</li>
              <li>To improve our proprietary matching algorithms and spatial data analysis.</li>
            </ul>
          </section>

          <section>
            <h2>4. Consent (Express & Implied)</h2>
            <p>
              By using our website and submitting the Vibe Quiz, you provide implied consent for us to analyze your lifestyle data. 
              When you submit your contact information through our concierge gateway to unlock properties or speak to an agent, you provide <strong>express consent</strong> for us to share that specific contact information with our licensed B2B real estate partners.
            </p>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement industry-standard encryption and security measures to protect your personal data against unauthorized access, alteration, or destruction. We do not sell your data to non-affiliated third-party data brokers; data is only shared securely with our designated real estate partners for the express purpose of assisting your property search.
            </p>
          </section>

          <section>
            <h2>6. Data Subject Rights (Habeas Data)</h2>
            <p>Under PIPEDA, you have the right to:</p>
            <ul>
              <li>Request access to the personal data we hold about you.</li>
              <li>Request corrections to any inaccurate or incomplete data.</li>
              <li>Withdraw your consent at any time (which may prevent us from providing further services or agent introductions).</li>
              <li>Request the deletion of your personal data from our systems.</li>
            </ul>
            <p>To exercise any of these rights, please contact our Data Privacy Officer using the contact information below.</p>
          </section>

          <section>
            <h2>7. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or the treatment of your data, please contact our Data Privacy Officer at:
            </p>
        <p><strong>Email:</strong> <a href="mailto:info@homevibes.app" style={{color: 'var(--color-primary)'}}>info@homevibes.app</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
