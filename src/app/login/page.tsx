'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Lock } from 'lucide-react';
import { login } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userFocused, setUserFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 400));

    const success = login(username, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow — emerald, bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Dot grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }}
      />

      {/* Secondary cyan glow — top-right */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          borderRadius: 24,
          padding: 48,
          margin: '0 16px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-outfit), Outfit, sans-serif',
              fontSize: '2rem',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#18181b',
            }}
          >
            Aegis
            <strong style={{ color: '#10b981', fontWeight: 700 }}>PV</strong>
          </span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            textAlign: 'center',
            color: '#52525b',
            fontSize: '0.875rem',
            marginBottom: 20,
          }}
        >
          AI-Powered Solar Intelligence
        </p>

        {/* Status badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px rgba(16,185,129,0.8)',
            }}
          />
          <span
            style={{
              fontSize: '0.75rem',
              color: '#10b981',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            System Operational
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Username */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: userFocused ? '#10b981' : '#52525b',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
                transition: 'color 0.2s',
              }}
            >
              <User size={16} strokeWidth={1.75} />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setUserFocused(true)}
              onBlur={() => setUserFocused(false)}
              required
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.03)',
                border: `1px solid ${userFocused ? '#10b981' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 12,
                padding: '12px 16px 12px 42px',
                color: '#18181b',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: passFocused ? '#10b981' : '#52525b',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
                transition: 'color 0.2s',
              }}
            >
              <Lock size={16} strokeWidth={1.75} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
              required
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.03)',
                border: `1px solid ${passFocused ? '#10b981' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 12,
                padding: '12px 16px 12px 42px',
                color: '#18181b',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: '#ef4444',
                fontSize: '0.82rem',
                textAlign: 'center',
                margin: 0,
              }}
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: 48,
              background: isLoading
                ? 'rgba(16,185,129,0.4)'
                : 'linear-gradient(135deg, #10b981, #06b6d4)',
              border: 'none',
              borderRadius: 12,
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s ease, transform 0.1s ease',
              letterSpacing: '0.01em',
              marginTop: 4,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.currentTarget as HTMLButtonElement).style.opacity = '0.9';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
