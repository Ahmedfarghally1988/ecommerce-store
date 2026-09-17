"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isAr = locale === 'ar';
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Login failed');
        return;
      }
      router.push(`/${locale}/admin`);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Ambient background decoration */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-950/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-200/40 dark:bg-purple-950/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-300/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30 text-white">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'لوحة التحكم' : 'Admin Dashboard'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
              {isAr ? 'المنطقة المخصصة للمسؤولين فقط' : 'Restricted area — Admins only'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm rounded-2xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="admin@example.com"
                className="w-full px-4 py-3.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 transition-all text-sm"
              />
              {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 transition-all text-sm pe-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>{isAr ? 'جاري الدخول...' : 'Signing in...'}</span>
                </>
              ) : (
                <span>{isAr ? 'دخول لوحة التحكم' : 'Sign In to Dashboard'}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
