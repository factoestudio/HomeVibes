import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';

export default function BlogPost({ post, onBack }) {
  if (!post) return <div>Post not found.</div>;

  // Generate JSON-LD Schema
  const isoDate = new Date(post.date).toISOString().split('T')[0];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Organization",
      "name": "HomeVibes Research"
    },
    "publisher": {
      "@type": "Organization",
      "name": "HomeVibes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://homevibes.app/logo512.png"
      }
    },
    "mainEntityOfPage": `https://homevibes.app/insights/${post.slug}`,
    "image": "https://homevibes.app/logo512.png",
    "datePublished": isoDate,
    "dateModified": isoDate
  };

  return (
    <div className="blog-post-container fade-in" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Helmet>
        <title>{post.title} | HomeVibes</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={`https://homevibes.app/insights/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <a href="/insights" className="btn-secondary" onClick={(e) => { e.preventDefault(); onBack(); }} style={{ marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Back to Insights
      </a>

      <article className="card-glass luxury-border" style={{ padding: '3rem', backgroundColor: 'var(--color-bg-dark)' }}>
        <header style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
          <span className="uppercase letter-spacing" style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>
            {post.category}
          </span>
          <h1 className="display-font platinum-text-glow" style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            {post.title}
          </h1>
          <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Published on {post.date}</p>
        </header>
        
        <div className="markdown-content" style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
