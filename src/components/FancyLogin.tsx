import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface FancyLoginProps {
  onSignIn?: () => void;
}

export function FancyLogin({ onSignIn }: FancyLoginProps) {
  const { resolvedTheme } = useTheme();
  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin');
  // For signup form fields
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  // Reset fields when switching mode
  React.useEffect(() => {
    setFirstName(''); setLastName(''); setEmail(''); setPassword('');
  }, [mode]);
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: resolvedTheme === 'dark'
          ? 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)'
          : 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)',
        transition: 'background 0.3s',
        borderTopLeftRadius: 0,
        margin: 0,
      }}
    >
      {/* Hero Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: resolvedTheme === 'dark' ? 0.05 : 0.1,
          backgroundImage: 'url(/images/hero-background.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      ></div>
      <div style={{ width: 660, background: 'transparent', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <img
          src={resolvedTheme === 'dark' ? '/images/lagentry-dark-logo-no-bg.png' : '/images/lagentry-light-logo.png'}
          alt="Lagentry"
          style={{ height: 72, width: 'auto', marginBottom: 16 }}
        />
  <h2 style={{ color: '#d3d3d3', fontSize: 22, fontWeight: 400, marginBottom: 32 }}>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
        <div
          className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#8B5CF6] rounded-lg w-full dark:focus:ring-[#8B5CF6] focus:border-transparent text-lg transition-colors duration-300 relative z-10"
          style={{
            display: 'flex',
            width: '100%',
            padding: 40,
            alignItems: mode === 'signup' ? 'center' : 'flex-start',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Social Buttons */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              marginRight: 32,
              minWidth: 250,
              alignItems: mode === 'signup' ? 'center' : 'flex-start',
              marginTop: mode === 'signup' ? 0 : undefined // aligns with First Name input
            }}
          >
            <button style={{ display: 'flex', alignItems: 'center', background: '#dd4b39', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600, fontSize: 16, height: 48, width: 240, marginBottom: 0, cursor: 'pointer', padding: 0, paddingLeft: 0, justifyContent: 'flex-start' }}>
              <svg width="22" height="22" viewBox="0 0 48 48" style={{ marginLeft: 18, marginRight: 18 }}><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 4.5 29.6 2 24 2 12.9 2 4 10.9 4 22s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.2 17.1 19.2 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 4.5 29.6 2 24 2 15.1 2 7.6 7.7 6.3 14.7z"/><path fill="#FBBC05" d="M24 44c5.6 0 10.5-1.8 14.3-4.9l-6.6-5.4C29.7 35.5 27 36.5 24 36.5c-6.1 0-11.2-4.1-13-9.6l-7 5.4C7.6 40.3 15.1 44 24 44z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 5.5-7.7 5.5-4.6 0-8.3-3.7-8.3-8.3s3.7-8.3 8.3-8.3c2.1 0 4 .7 5.5 2.1l6.4-6.4C34.5 4.5 29.6 2 24 2c-7.2 0-13 5.8-13 13s5.8 13 13 13c3.1 0 5.9-1.1 8.1-2.9l6.4 6.4C34.5 39.5 29.6 42 24 42z"/></g></svg>
              <span style={{ fontWeight: 600, fontSize: 16 }}>Sign in with Google</span>
            </button>
            <button style={{ display: 'flex', alignItems: 'center', background: '#3b5998', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600, fontSize: 16, height: 48, width: 240, marginBottom: 0, cursor: 'pointer', padding: 0, paddingLeft: 0, justifyContent: 'flex-start' }}>
              <svg width="22" height="22" viewBox="0 0 32 32" style={{ marginLeft: 18, marginRight: 18 }}><path fill="#fff" d="M29 0H3C1.3 0 0 1.3 0 3v26c0 1.7 1.3 3 3 3h13V20h-4v-5h4v-3.7C16 7.6 18.4 6 21.1 6c1.3 0 2.6.1 2.9.2v4h-2c-1.6 0-2 .8-2 2v3h4.5l-.6 5H20v12h9c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3z"/></svg>
              <span style={{ fontWeight: 600, fontSize: 16 }}>Sign in with Facebook</span>
            </button>
            <button style={{ display: 'flex', alignItems: 'center', background: '#55acee', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600, fontSize: 16, height: 48, width: 240, marginBottom: 0, cursor: 'pointer', padding: 0, paddingLeft: 0, justifyContent: 'flex-start' }}>
              <svg width="22" height="22" viewBox="0 0 32 32" style={{ marginLeft: 18, marginRight: 18 }}><path fill="#fff" d="M32 6.1a13.1 13.1 0 0 1-3.8 1 6.6 6.6 0 0 0 2.9-3.6 13.2 13.2 0 0 1-4.2 1.6A6.6 6.6 0 0 0 22.2 4c-3.6 0-6.6 3-6.6 6.6 0 .5.1 1 .2 1.5C10.3 11.8 5.5 9.2 2.2 5.2c-.6 1-.9 2.1-.9 3.3 0 2.3 1.2 4.3 3.1 5.5a6.6 6.6 0 0 1-3-.8v.1c0 3.2 2.3 5.8 5.4 6.4-.6.2-1.2.2-1.8.2-.4 0-.9 0-1.3-.1.9 2.7 3.4 4.7 6.4 4.7A13.3 13.3 0 0 1 0 27.5c2.3 1.5 5.1 2.4 8.1 2.4 9.7 0 15-8 15-15v-.7A10.7 10.7 0 0 0 32 6.1z"/></svg>
              <span style={{ fontWeight: 600, fontSize: 16 }}>Sign in with Twitter</span>
            </button>
          </div>
          {/* Divider */}
          <div style={{ borderLeft: '2px solid #fff', margin: '0 24px', minHeight: 220 }}></div>
          {/* Auth Form */}
          {mode === 'signin' ? (
            <form style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 18, minWidth: 240 }} onSubmit={e => { e.preventDefault(); if (onSignIn) onSignIn(); }}>
              <input
                type="email"
                placeholder="Email"
                className="w-full h-12 px-4 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6] focus:border-transparent text-lg transition-colors duration-300 relative z-10 mb-4"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full h-12 px-4 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6] focus:border-transparent text-lg transition-colors duration-300 relative z-10 mb-4"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <button type="submit" style={{ height: 48, width: 90, background: '#428bca', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 8 }}>Sign In</button>
                <a href="#" style={{ color: '#d3d3d3', fontSize: 14, textDecoration: 'underline', marginLeft: 8 }}>Forgot password?</a>
              </div>
              <div style={{ textAlign: 'center', color: '#d3d3d3', fontSize: 15, marginTop: 10 }}>
                Need an account?{' '}
                <a href="#" style={{ color: '#fff', textDecoration: 'underline', cursor: 'pointer' }} onClick={e => { e.preventDefault(); setMode('signup'); }}>Sign up</a>
              </div>
            </form>
          ) : (
            <form style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 18, minWidth: 240 }} onSubmit={e => { e.preventDefault(); if (onSignIn) onSignIn(); }}>
              <input
                type="text"
                placeholder="First Name"
                className="w-full h-12 px-4 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6] focus:border-transparent text-lg transition-colors duration-300 relative z-10 mb-4"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full h-12 px-4 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6] focus:border-transparent text-lg transition-colors duration-300 relative z-10 mb-4"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full h-12 px-4 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6] focus:border-transparent text-lg transition-colors duration-300 relative z-10 mb-4"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full h-12 px-4 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6] focus:border-transparent text-lg transition-colors duration-300 relative z-10 mb-4"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8, width: '100%' }}>
                <button type="submit" style={{ height: 48, width: 120, background: '#8B5CF6', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600, fontSize: 16, cursor: 'pointer', marginBottom: 12 }}>Sign Up</button>
                <div style={{ textAlign: 'center', color: '#d3d3d3', fontSize: 15 }}>
                  Already have an account?{' '}
                  <a href="#" style={{ color: '#fff', textDecoration: 'underline', cursor: 'pointer' }} onClick={e => { e.preventDefault(); setMode('signin'); }}>Sign in</a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
