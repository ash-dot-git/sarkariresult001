"use client";

import { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!secret) {
      setError('Please enter the admin secret.');
      return;
    }
    // The actual check will be done in the parent component
    const success = onLogin(secret);
    if (!success) {
      setError('Invalid secret. Please try again.');
    }
  };

  return (
    <div className="flex flex-col p-16 items-center justify-center flex-grow bg-gray-50">
      <div className="w-full  max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="secret" className="text-sm font-medium text-gray-700 sr-only">
              Admin Secret
            </label>
            <input
              id="secret"
              name="secret"
              type="password"
              autoComplete="current-password"
              required
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Admin Secret"
            />
          </div>

          {error && <p className="text-sm text-center text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}