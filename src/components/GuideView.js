import React from 'react';
import SEOHead from './SEOHead';
import { guidesData } from '../data/guidesData';
import { neighborhoodsData } from '../data/neighborhoodsData';

export default function GuideView({ guideSlug, navigateTo, onStartQuiz }) {
  const guide = guidesData.find(g => g.slug === guideSlug) || guidesData[0];
  const canonicalUrl = `https://homevibes.app/guides/${guide.slug}`;

  const recommendedAreas = (guide.topNeighborhoodIds || [])
    .map(id => neighborhoodsData.find(n => n.id === id))
    .filter(Boolean);

  // Structured Data Schema.org JSON-LD (@graph)
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://homevibes.app/" },
          { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://homevibes.app/guides" },
          { "@type": "ListItem", "position": 3, "name": guide.title, "item": canonicalUrl }
        ]
      },
      {
        "@type": "Article",
        "headline": guide.title,
        "description": guide.description,
        "author": { "@type": "Organization", "name": "HomeVibes Research" },
        "publisher": { "@type": "Organization", "name": "HomeVibes", "logo": { "@type": "ImageObject", "url": "https://homevibes.app/logo512.png" } },
        "mainEntityOfPage": canonicalUrl
      },
      {
        "@type": "FAQPage",
        "mainEntity": (guide.faqs || []).map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="guide-view-container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <SEOHead
        title={`${guide.title} | HomeVibes 2026 Lifestyle Guide`}
        description={guide.description}
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

      <header className="card-glass luxury-border" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2.5rem', borderRadius: '16px' }}>
        <span className="uppercase letter-spacing" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
          Target Persona: {guide.persona}
        </span>
        <h1 className="display-font platinum-text-glow" style={{ fontSize: '2.4rem', margin: '0.75rem 0' }}>
          {guide.title}
        </h1>
        <p style={{ opacity: 0.9, maxWidth: '750px', margin: '0 auto', lineHeight: 1.6, fontSize: '1.05rem' }}>
          {guide.description}
        </p>
      </header>

      {/* Key Highlights */}
      <section className="card-glass luxury-border" style={{ padding: '2rem', borderRadius: '14px', marginBottom: '2.5rem' }}>
        <h3 className="display-font" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Key Lifestyle Criteria</h3>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8, fontSize: '1rem' }}>
          {guide.highlights?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Recommended Neighborhoods List */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="display-font" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Top Recommended Neighborhoods</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {recommendedAreas.map((area, idx) => (
            <div key={area.id} className="card-glass luxury-border" style={{ padding: '2rem', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <span className="uppercase" style={{ fontSize: '0.75rem', color: '#B0C4DE', fontWeight: 700 }}>#{idx + 1} {area.city}</span>
                  <h3 className="display-font" style={{ fontSize: '1.6rem', margin: '0.2rem 0 0 0' }}>{area.name}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600, display: 'block' }}>{area.priceBracket}</span>
                  <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Rent: {area.avgRent} | Buy: {area.avgBuy}</span>
                </div>
              </div>

              <p style={{ opacity: 0.9, lineHeight: 1.6, marginBottom: '1rem' }}>{area.description}</p>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {area.tags?.map((tag, tIdx) => (
                  <span key={tIdx} style={{ background: 'rgba(147,51,234,0.15)', border: '1px solid rgba(147,51,234,0.3)', color: '#E9D5FF', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: '0.9rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                <strong>Why it fits:</strong> Walkability {area.transit?.walkability}/10. Top spots: {area.localSpots?.slice(0, 3).join(', ')}.
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      {guide.faqs && guide.faqs.length > 0 && (
        <section className="card-glass luxury-border" style={{ padding: '2.5rem', borderRadius: '16px', marginBottom: '3rem' }}>
          <h3 className="display-font" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Frequently Asked Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {guide.faqs.map((faq, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: 'var(--color-primary)' }}>{faq.question}</h4>
                <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.6, fontSize: '0.95rem' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Box */}
      <div className="card-glass luxury-border" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(147,51,234,0.15), rgba(59,130,246,0.15))' }}>
        <h3 className="display-font" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Personalize Your Neighborhood Search</h3>
        <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem auto', opacity: 0.9 }}>
          Every home buyer is unique. Tell us your exact commute, lifestyle preferences, and budget to get a custom weighted score.
        </p>
        <button
          className="story-hero-btn pulse-glow"
          onClick={() => { if (onStartQuiz) onStartQuiz(); else if (navigateTo) navigateTo('/quiz'); }}
          style={{ cursor: 'pointer', fontSize: '1rem', padding: '0.85rem 2rem' }}
        >
          Start the Vibe Quiz &rarr;
        </button>
      </div>
    </div>
  );
}
