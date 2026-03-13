'use client';

import { useState, FormEvent, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare, Eye, EyeOff } from 'lucide-react';
import Spinner from '@/components/UI/Spinner';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const { login, register } = useAuth();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const validatePasswordMatch = (value: string) => {
    const confirmInput = confirmPasswordRef.current;
    if (!confirmInput) return;

    if (value && value !== password) {
      confirmInput.setCustomValidity('Passwords do not match');
      confirmInput.reportValidity();
      setError('Passwords do not match');
    } else {
      confirmInput.setCustomValidity('');
      if (error === 'Passwords do not match') {
        setError('');
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'register' && password !== confirmPassword) {
      validatePasswordMatch(confirmPassword);
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Glowing bg blob */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand/10 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-brand/15 border border-brand/30 rounded-2xl flex items-center justify-center mb-4">
            <MessageSquare className="text-brand" size={28} />
          </div>
          <h1 className="text-2xl font-bold">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {mode === 'login' ? 'Sign in to your ChatDApp account' : 'Start chatting in seconds'}
          </p>
        </div>

        {/* Card */}
        <div className="card shadow-2xl shadow-black/40">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
                  Display Name
                </label>
                <input
                  className="input-base"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                className="input-base"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  className="input-base pr-12"
                  type={showPw ? 'text' : 'password'}
                  placeholder={mode === 'register' ? 'Min 6 characters' : 'Your password'}
                  value={password}
                  onChange={(e) => {
                    const nextPassword = e.target.value;
                    setPassword(nextPassword);
                    if (mode === 'register' && confirmPassword) {
                      validatePasswordMatch(confirmPassword);
                    }
                  }}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  onClick={() => setShowPw((p) => !p)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
                  Retype Password
                </label>
                <div className="relative">
                  <input
                    ref={confirmPasswordRef}
                    className="input-base pr-12"
                    type={showConfirmPw ? 'text' : 'password'}
                    placeholder="Retype password"
                    value={confirmPassword}
                    onChange={(e) => {
                      const value = e.target.value;
                      setConfirmPassword(value);
                      validatePasswordMatch(value);
                    }}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    onClick={() => setShowConfirmPw((p) => !p)}
                  >
                    {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary flex items-center justify-center gap-2 mt-1" disabled={loading}>
              {loading ? <Spinner size={18} /> : null}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <Link
              href={mode === 'login' ? '/register' : '/login'}
              className="text-brand hover:text-brand-light font-semibold transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
