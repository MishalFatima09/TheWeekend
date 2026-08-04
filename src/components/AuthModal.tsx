'use client';

import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, User, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  initialRole?: 'admin' | 'member';
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialRole }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  // 1-Click Quick Demo Account Login Helpers
  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      setSubmitting(true);
      setErrorMsg('');

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPass })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Login failed.');
        return;
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErrorMsg('');

      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body = mode === 'login' ? { email, password } : { name, email, password, phone };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Authentication failed.');
        return;
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[32px] p-6 md:p-8 retro-shadow-lg max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#F2D8D5] border-2 border-[#5A3B38] text-[#5A3B38] p-2 rounded-full hover:rotate-90 transition-transform"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#5A3B38] text-[#FAF0EE] rounded-full mx-auto flex items-center justify-center font-serif-display font-black text-lg mb-2 border border-[#5A3B38]">
            WKD
          </div>
          <h3 className="font-serif-display text-2xl font-black text-[#5A3B38]">
            {mode === 'login' ? 'Welcome Back to the Club' : 'Create Member Account'}
          </h3>
          <p className="text-xs text-[#7B5A58] mt-1 font-mono">
            {mode === 'login' ? 'Sign in to view your tickets and fast registration' : 'Join for free and unlock priority event passes'}
          </p>
        </div>

        {/* 1-Click Quick Demo Login Shortcuts Banner */}
        <div className="bg-[#D7B4A8] border-2 border-[#5A3B38] rounded-2xl p-3 mb-6 text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#342224] font-bold block mb-2">
            ⚡ Quick Demo Accounts (One-Click)
          </span>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handleQuickLogin('member@weekendclub.com', 'member123')}
              className="bg-[#FAF0EE] border border-[#5A3B38] hover:bg-[#5A3B38] hover:text-white px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all"
            >
              <User className="w-3.5 h-3.5" /> Demo Member
            </button>

            <button
              onClick={() => handleQuickLogin('admin@weekendclub.com', 'admin123')}
              className="bg-[#D97706] text-white border border-[#5A3B38] hover:bg-[#B45309] px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Demo Admin
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-[#FEE2E2] border-2 border-[#DC2626] text-[#991B1B] p-3 rounded-2xl text-xs font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-[#5A3B38] mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full px-4 py-2.5 text-xs text-[#342224] focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#5A3B38] mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@weekendclub.com"
              className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full px-4 py-2.5 text-xs text-[#342224] focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5A3B38] mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full px-4 py-2.5 text-xs text-[#342224] focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-[#5A3B38] mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 0192"
                className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full px-4 py-2.5 text-xs text-[#342224] focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#5A3B38] text-[#FAF0EE] border-2 border-[#5A3B38] hover:bg-[#7B5A58] py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 retro-shadow transition-all disabled:opacity-50 mt-2"
          >
            <span>{mode === 'login' ? 'Sign In to Account' : 'Create Member Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-[#D7B4A8]">
          {mode === 'login' ? (
            <p className="text-xs text-[#7B5A58]">
              Don't have an account yet?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-bold text-[#5A3B38] underline"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p className="text-xs text-[#7B5A58]">
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-bold text-[#5A3B38] underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
