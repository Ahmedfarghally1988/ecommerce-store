"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import Link from 'next/link';
import { Eye, EyeOff, ShoppingBag, Clock, Ban, AlertTriangle } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: {
    icon: Clock,
    color: 'amber',
    title: 'Account Pending Approval',
    titleAr: 'الحساب في انتظار الموافقة',
    message: 'Your account is under review. You will be able to login once an admin approves your account.',
    messageAr: 'حسابك قيد المراجعة. ستتمكن من تسجيل الدخول بمجرد أن يوافق المسؤول على طلبك.',
  },
  REJECTED: {
    icon: Ban,
    color: 'red',
    title: 'Account Rejected',
    titleAr: 'تم رفض الحساب',
    message: 'Your account registration has been rejected. Please contact our support team for assistance.',
    messageAr: 'تم رفض طلب تسجيلك. يرجى التواصل مع فريق الدعم للمساعدة.',
  },
  SUSPENDED: {
    icon: AlertTriangle,
    color: 'orange',
    title: 'Account Suspended',
    titleAr: 'الحساب موقوف',
    message: 'Your account has been suspended. Please contact support to resolve this issue.',
    messageAr: 'تم تعليق حسابك. يرجى التواصل مع الدعم لحل هذه المشكلة.',
  },
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isAr = locale === 'ar';

  const [error, setError] = useState<string | null>(null);
  const [customerStatus, setCustomerStatus] = useState<string | null>(
    searchParams.get('status')
  );
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    setCustomerStatus(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.customerStatus) {
          setCustomerStatus(json.customerStatus);
        } else {
          setError(json.error || 'Login failed');
        }
        return;
      }

      const callbackUrl = searchParams.get('callbackUrl') || `/${locale}/account`;
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const statusInfo = customerStatus ? STATUS_CONFIG[customerStatus as keyof typeof STATUS_CONFIG] : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Ambient background decoration */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-200/40 dark:bg-blue-950/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-950/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">     
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-300/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30 text-white">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
              {isAr ? 'أهلاً بك مجدداً، سجّل دخولك للوصول لحسابك' : 'Welcome back, sign in to your account'}
            </p>
          </div>

          {/* Status-based messages */}
          {statusInfo && (
            <div className={`mb-6 p-4 rounded-2xl border flex gap-3 ${
              statusInfo.color === 'amber' ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800/50 dark:text-amber-200' :
              statusInfo.color === 'red' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800/50 dark:text-red-200' :
              'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/40 dark:border-orange-800/50 dark:text-orange-200'
            }`}>
              <statusInfo.icon className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">{isAr ? statusInfo.titleAr : statusInfo.title}</p>
                <p className="text-xs mt-1 opacity-90">{isAr ? statusInfo.messageAr : statusInfo.message}</p>
              </div>
            </div>
          )}

          {/* General error */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-300 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" method="POST">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder={isAr ? 'أدخل بريدك الإلكتروني' : 'you@example.com'}
                className="w-full px-4 py-3.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-b border-gray-200 transition-all text-sm"
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
                  placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter your password'}
                  className="w-full px-4 py-3.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-b border-gray-200 transition-all text-sm pe-12"
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
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 text-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>{isAr ? 'جاري تسجيل الدخول...' : 'Signing in...'}</span>
                </>
              ) : (
                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isAr ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
              <Link href={`/${locale}/register`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold hover:underline transition-colors">
                {isAr ? 'سجّل الآن' : 'Register'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
