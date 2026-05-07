import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // This must match the URL where the app is hosted
          emailRedirectTo: window.location.origin + '/dashboard',
        },
      });

      if (error) throw error;
      navigate('/verify');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--bg-primary, #030712)'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2.5rem',
        background: 'var(--bg-secondary, #111827)',
        borderRadius: '1rem',
        border: '1px solid var(--border-color, #1f2937)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
          Margin Protection Protocol
        </h1>
        <p style={{ color: 'var(--text-muted, #9ca3af)', marginBottom: '2rem' }}>
          Enter your email to access free dashboard
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            required={true}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'var(--bg-tertiary, #1f2937)',
              border: '1px solid var(--border-color, #374151)',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'var(--accent-primary, #6366f1)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Sending magic link...' : 'Get Access'}
          </button>
        </form>

        {error && (
          <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.875rem' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
