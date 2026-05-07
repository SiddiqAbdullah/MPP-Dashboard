import React from 'react';
import { MailCheck } from 'lucide-react';

export default function VerifyPage() {
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
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            background: 'rgba(99, 102, 241, 0.1)', 
            padding: '1rem', 
            borderRadius: '50%' 
          }}>
            <MailCheck size={48} color="var(--accent-primary, #6366f1)" />
          </div>
        </div>
        
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
          Check your email
        </h1>
        <p style={{ color: 'var(--text-muted, #9ca3af)', lineHeight: '1.5' }}>
          We've sent a magic link to your email address. Click the link to verify and access the dashboard.
        </p>
      </div>
    </div>
  );
}
