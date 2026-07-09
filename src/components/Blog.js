import React from 'react';

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'GTA Urban Analysis: The Rise of Transit-Oriented Communities',
      date: 'July 8, 2026',
      excerpt: 'How the new Ontario Line and Hurontario LRT are reshaping neighborhood desirability and luxury real estate values.',
      category: 'Urban Analysis'
    },
    {
      id: 2,
      title: 'Summer 2026 Market Trends: The "Math Over Dreaming" Era',
      date: 'July 1, 2026',
      excerpt: 'Buyers are taking a pragmatic approach to luxury real estate. We break down the latest stats and consumer psychology.',
      category: 'Market Trends'
    },
    {
      id: 3,
      title: 'The Missing Middle: Why Townhomes are the New Gold Standard',
      date: 'June 24, 2026',
      excerpt: 'As detached home prices stabilize, the demand for high-end, family-sized townhomes is skyrocketing in the inner suburbs.',
      category: 'Research'
    }
  ];

  return (
    <div className="blog-container fade-in" style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="display-font platinum-text-glow" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>HomeVibes Insights</h1>
        <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>Urban analysis, market trends, and research from the HomeVibes data team.</p>
      </div>

      <div className="blog-grid" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {posts.map(post => (
          <div key={post.id} className="card-glass luxury-border" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <span className="uppercase letter-spacing" style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1rem', display: 'block' }}>
              {post.category} &bull; {post.date}
            </span>
            <h2 className="display-font" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{post.title}</h2>
            <p style={{ opacity: 0.8, lineHeight: 1.5, marginBottom: '2rem', flexGrow: 1 }}>{post.excerpt}</p>
            <button className="luxury-btn" style={{ alignSelf: 'flex-start', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
              Read Article
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
