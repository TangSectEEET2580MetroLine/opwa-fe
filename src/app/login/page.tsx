'use client';

import React, { useState } from 'react';
import { login } from '../../api/auth';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const { setAuth } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setAuth(await login(email, password));
      router.push('/');
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign in to OPWA</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2">Login</button>
          {error && <div className="alert alert-error mt-2 py-2 text-sm">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;