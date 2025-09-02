import React, { useState } from 'react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

export function LoginPage({ onLoginSuccess, onForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    onLoginSuccess();
  };

  return (
  <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)' }}>
      <div className="bg-white dark:bg-[#181028] rounded-2xl shadow-xl p-10 flex flex-col items-center w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Login</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#23232a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 dark:text-gray-200 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#23232a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-lg transition-colors duration-200"
          >
            Login
          </button>
        </form>
        <button
          className="mt-4 text-indigo-600 hover:underline text-sm"
          onClick={onForgotPassword}
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
}
// LoginPage removed
