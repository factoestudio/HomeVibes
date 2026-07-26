import React, { useEffect } from 'react';

export default function SEOHead({ title, description, canonicalUrl, ogType = 'website', jsonLd = null }) {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title;
    }

    // 2. Update Meta Tags
    const setMeta = (selector, attribute, value) => {
      if (!value) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('=');
        el.setAttribute(attrName, attrVal.replace(/["']/g, ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attribute, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:type"]', 'content', ogType);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);

    if (canonicalUrl) {
      setMeta('meta[property="og:url"]', 'content', canonicalUrl);
      setMeta('meta[name="twitter:url"]', 'content', canonicalUrl);
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // 3. Inject Dynamic JSON-LD Schema
    let scriptTag = document.getElementById('dynamic-jsonld');
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Cleanup custom JSON-LD on unmount
      const tag = document.getElementById('dynamic-jsonld');
      if (tag) tag.remove();
    };
  }, [title, description, canonicalUrl, ogType, jsonLd]);

  return null;
}
