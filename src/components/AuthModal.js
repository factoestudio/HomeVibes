import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../App.css';

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!process.env.REACT_APP_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL.includes('placeholder')) {
      setError('Supabase credentials missing on server. Please add REACT_APP_SUPABASE_URL to Vercel Environment Variables.');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      let error;
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        error = signInError;
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        error = signUpError;
        if (!error) {
          setMessage('Check your email for the confirmation link.');
          if (data?.session) {
            onClose();
          }
        }
      }
      if (error) throw error;
      if (isLogin) onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(7,8,11,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
      <div className="modal-content luxury-border glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: '16px', position: 'relative', background: 'var(--bg-card)' }}>
        <button className="close-btn" onClick={onClose} style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        
        <h2 className="display-font" style={{ marginBottom: '1.5rem', color: 'var(--text-main)', textAlign: 'center' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && <div className="auth-error" style={{ color: '#ff4d4d', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
        {message && <div className="auth-message" style={{ color: '#4CAF50', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}
        
        <form onSubmit={handleAuth} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="luxury-input"
            style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-main)', width: '100%', boxSizing: 'border-box' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="luxury-input"
            style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-main)', width: '100%', boxSizing: 'border-box' }}
          />
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.85rem', marginTop: '0.5rem', width: '100%' }}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <span style={{ padding: '0 10px', fontSize: '0.85rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button 
            type="button" 
            className="luxury-btn-header" 
            style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            onClick={() => handleOAuth('google')}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </div>
        
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '600' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
}
