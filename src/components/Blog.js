import React from 'react';
import BlogPost from './BlogPost';
import { blogPosts } from '../data/blogPosts';

export default function Blog({ activeSlug, navigateTo }) {
  const selectedPost = activeSlug 
    ? blogPosts.find(p => p.slug === activeSlug || String(p.id) === String(activeSlug))
    : null;

  if (selectedPost) {
    return <BlogPost post={selectedPost} onBack={() => navigateTo ? navigateTo('/insights') : null} />;
  }

  return (
    <div className="blog-container fade-in" style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="display-font platinum-text-glow" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>HomeVibes Insights</h1>
        <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>Urban analysis, market trends, and research from the HomeVibes data team.</p>
      </div>

      <div className="blog-grid" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {blogPosts.map(post => (
          <div key={post.id} className="card-glass luxury-border" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <span className="uppercase letter-spacing" style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1rem', display: 'block', color: 'var(--color-primary)' }}>
              {post.category} &bull; {post.date}
            </span>
            <h2 className="display-font" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{post.title}</h2>
            <p style={{ opacity: 0.8, lineHeight: 1.5, marginBottom: '2rem', flexGrow: 1 }}>{post.excerpt}</p>
            <button 
              className="btn-luxury" 
              style={{ alignSelf: 'flex-start', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
              onClick={() => navigateTo ? navigateTo(`/insights/${post.slug}`) : null}
            >
              Read Article
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
