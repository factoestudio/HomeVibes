import React from 'react';
import SEOHead from './SEOHead';
import { getComparisonData } from '../data/comparisonData';
import { neighborhoodsData } from '../data/neighborhoodsData';

export default function ComparisonView({ pairSlug, navigateTo, onStartQuiz }) {
  const compData = getComparisonData(pairSlug) || {
    area1: neighborhoodsData[0],
    area2: neighborhoodsData[1],
    title: 'Neighborhood Comparison | HomeVibes',
    description: 'Compare Toronto & GTA neighborhoods side-by-side.',
    faqs: []
  };

  const { area1, area2, title, description, faqs } = compData;
  const canonicalUrl = `https://homevibes.app/compare/${pairSlug || 'junction-vs-leslieville'}`;

  // Structured Data Schema.org JSON-LD (@graph)
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://homevibes.app/" },
          { "@type": "ListItem", "position": 2, "name": "Compare", "item": "https://homevibes.app/compare" },
          { "@type": "ListItem", "position": 3, "name": `${area1.name} vs ${area2.name}`, "item": canonicalUrl }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@type": "Place",
        "name": area1.name,
        "description": area1.description,
        "address": { "@type": "PostalAddress", "addressLocality": area1.city, "addressRegion": "ON", "addressCountry": "CA" }
      },
      {
        "@type": "Place",
        "name": area2.name,
        "description": area2.description,
        "address": { "@type": "PostalAddress", "addressLocality": area2.city, "addressRegion": "ON", "addressCountry": "CA" }
      }
    ]
  };

  return (
    <div className="comparison-view-container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <SEOHead
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLdSchema}
      />

      <div style={{ marginBottom: '1.5rem' }}>
        <button
          className="btn-header-action luxury-btn-header"
          onClick={() => navigateTo && navigateTo('/')}
          style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}
        >
          &larr; Back to Home
        </button>
      </div>

      <header className="card-glass luxury-border" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2rem', borderRadius: '16px' }}>
        <span className="uppercase letter-spacing" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
          2026 GTA Neighborhood Comparison
        </span>
        <h1 className="display-font platinum-text-glow" style={{ fontSize: '2.4rem', margin: '0.75rem 0' }}>
          {area1.name} <span style={{ color: 'var(--color-primary)' }}>vs</span> {area2.name}
        </h1>
        <p style={{ opacity: 0.85, maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
          {description}
        </p>
      </header>

      {/* Side by Side Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Area 1 Card */}
        <div className="card-glass luxury-border" style={{ padding: '2rem', borderRadius: '14px' }}>
          <span className="uppercase" style={{ fontSize: '0.75rem', color: '#B0C4DE', fontWeight: 700 }}>{area1.city}</span>
          <h2 className="display-font" style={{ fontSize: '1.8rem', marginTop: '0.25rem', marginBottom: '1rem' }}>{area1.name}</h2>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '1.5rem' }}>{area1.description}</p>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Avg Rent:</span> <strong>{area1.avgRent}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Avg Buy:</span> <strong>{area1.avgBuy}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Price Bracket:</span> <strong>{area1.priceBracket}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Walkability:</span> <strong>{area1.transit?.walkability}/10</strong>
            </div>
          </div>

          <h4 style={{ color: 'var(--color-primary)', marginTop: '1rem', marginBottom: '0.5rem' }}>Pros</h4>
          <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
            {area1.pros?.map((p, idx) => <li key={idx}>{p}</li>)}
          </ul>

          <h4 style={{ color: '#FBBF24', marginTop: '1rem', marginBottom: '0.5rem' }}>Considerations</h4>
          <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
            {area1.cons?.map((c, idx) => <li key={idx}>{c}</li>)}
          </ul>
        </div>

        {/* Area 2 Card */}
        <div className="card-glass luxury-border" style={{ padding: '2rem', borderRadius: '14px' }}>
          <span className="uppercase" style={{ fontSize: '0.75rem', color: '#B0C4DE', fontWeight: 700 }}>{area2.city}</span>
          <h2 className="display-font" style={{ fontSize: '1.8rem', marginTop: '0.25rem', marginBottom: '1rem' }}>{area2.name}</h2>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '1.5rem' }}>{area2.description}</p>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Avg Rent:</span> <strong>{area2.avgRent}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Avg Buy:</span> <strong>{area2.avgBuy}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Price Bracket:</span> <strong>{area2.priceBracket}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Walkability:</span> <strong>{area2.transit?.walkability}/10</strong>
            </div>
          </div>

          <h4 style={{ color: 'var(--color-primary)', marginTop: '1rem', marginBottom: '0.5rem' }}>Pros</h4>
          <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
            {area2.pros?.map((p, idx) => <li key={idx}>{p}</li>)}
          </ul>

          <h4 style={{ color: '#FBBF24', marginTop: '1rem', marginBottom: '0.5rem' }}>Considerations</h4>
          <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
            {area2.cons?.map((c, idx) => <li key={idx}>{c}</li>)}
          </ul>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <section className="card-glass luxury-border" style={{ padding: '2.5rem', borderRadius: '16px', marginBottom: '3rem' }}>
        <h3 className="display-font" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: 'var(--color-primary)' }}>{faq.question}</h4>
              <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.6, fontSize: '0.95rem' }}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <div className="card-glass luxury-border" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(147,51,234,0.15), rgba(59,130,246,0.15))' }}>
        <h3 className="display-font" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Which neighborhood matches YOUR vibe?</h3>
        <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem auto', opacity: 0.9 }}>
          Take the 60-second HomeVibes quiz to match your exact commute, budget, and lifestyle preferences.
        </p>
        <button
          className="story-hero-btn pulse-glow"
          onClick={() => { if (onStartQuiz) onStartQuiz(); else if (navigateTo) navigateTo('/quiz'); }}
          style={{ cursor: 'pointer', fontSize: '1rem', padding: '0.85rem 2rem' }}
        >
          Take the Vibe Quiz &rarr;
        </button>
      </div>
    </div>
  );
}
