'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { authApi } from '@/lib/api';
import { Shield, Lock, AtSign } from 'lucide-react';

export default function AdminLoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login(email, password);
      if (res.success && res.accessToken) {
        localStorage.setItem('admin_token', res.accessToken);
        router.push('/admin');
      } else {
        setError(t.admin.loginError);
      }
    } catch {
      setError(t.admin.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-950 flex items-center justify-center relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
      }} />
      
      {/* Tri-color bar accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 flex">
        <div className="flex-1 bg-[#1a7a3a]" />
        <div className="flex-1 bg-[#d4a017]" />
        <div className="flex-1 bg-[#c0392b]" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Logo / Brand Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-5 shadow-2xl">
            <Shield className="w-10 h-10 text-[#d4a017]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Gore Woreda</h1>
          <p className="text-emerald-200/80 text-sm mt-1 font-medium">Administration Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-white/10 p-8 md:p-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.admin.login}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in to manage your website</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t.admin.email}</label>
              <div className="relative">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#1a7a3a] focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 transition"
                  placeholder="admin@gore.gov.et"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t.admin.password}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#1a7a3a] focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 transition"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a7a3a] hover:bg-[#14632f] text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {loading ? 'Signing in...' : t.admin.signIn}
            </button>
          </form>

          {/* Footer branding */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#1a7a3a]" />
              <div className="w-2 h-2 rounded-full bg-[#d4a017]" />
              <div className="w-2 h-2 rounded-full bg-[#c0392b]" />
            </div>
            <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-3">
              © {new Date().getFullYear()} Gore Woreda Administration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
