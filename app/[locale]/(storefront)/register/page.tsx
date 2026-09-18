"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/lib/validations/auth';
import Link from 'next/link';
import { Eye, EyeOff, ShoppingBag, CheckCircle, AlertTriangle } from 'lucide-react';

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const isAr = locale === 'ar';
  
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Registration failed');
        return;
      }
      
      if (json.requiresVerification) {
        setEmail(json.email);
        setStep('otp');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setError(isAr ? 'يرجى إدخال الرمز المكون من 6 أرقام' : 'Please enter the 6-digit code');
      return;
    }
    setError(null);
    setVerifying(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpCode }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Verification failed');
        setVerifying(false);
        return;
      }
      
      // Success!
      window.location.href = `/${locale}`; // Redirect to home logged in
    } catch {
      setError('Network error. Please try again.');
      setVerifying(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
        {/* Ambient background decoration */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-200/40 dark:bg-emerald-950/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-200/40 dark:bg-blue-950/30 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 text-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-300/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {isAr ? 'تم التسجيل بنجاح!' : 'Registration Successful!'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              {isAr
                ? 'تم إنشاء حسابك وهو الآن في انتظار مراجعة وموافقة الإدارة. سيتم إشعارك عند تفعيل حسابك.'
                : 'Your account has been created and is now pending admin review and approval. You will be notified once your account is activated.'}
            </p>
            <Link
              href={`/${locale}/login`}
              className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all text-sm"
            >
              {isAr ? 'الذهاب لتسجيل الدخول' : 'Go to Login'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-200/40 dark:bg-blue-950/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-950/30 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-300/50 dark:shadow-none border border-slate-100 dark:border-slate-800 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {isAr ? 'تأكيد البريد الإلكتروني' : 'Verify Email'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              {isAr ? 'لقد أرسلنا رمزاً مكوناً من 6 أرقام إلى' : 'We sent a 6-digit code to'} <br/>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">{email}</span>
            </p>
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-300 text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full px-4 py-4 text-center text-3xl tracking-[0.5em] sm:tracking-[1em] font-bold bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-300 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-b border-gray-200lue-600 transition-all"
                  dir="ltr"
                />
              </div>
              <button
                type="submit"
                disabled={verifying || otpCode.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 text-sm"
              >
                {verifying ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <span>{isAr ? 'جاري التحقق...' : 'Verifying...'}</span>
                  </>
                ) : (
                  <span>{isAr ? 'تحقق ومتابعة' : 'Verify & Continue'}</span>
                )}
              </button>
            </form>

            <button
              onClick={() => {
                setStep('register');
                setOtpCode('');
                setError(null);
              }}
              className="mt-6 w-full text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 text-sm font-medium transition-colors"
            >
              {isAr ? 'هل أخطأت في كتابة الإيميل؟ تراجع وتعديل' : 'Typed the wrong email? Go back and edit'}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              {isAr ? 'إنشاء حساب جديد' : 'Create Account'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
              {isAr ? 'انضم إلينا واستمتع بتجربة تسوق فريدة' : 'Join us to enjoy a seamless shopping experience'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-300 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'الاسم الكامل' : 'Full Name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                autoComplete="name"
                {...register('name')}
                placeholder={isAr ? 'محمد أحمد' : 'John Doe'}
                className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-b border-gray-200lue-600 transition-all text-sm"
              />
              {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-b border-gray-200lue-600 transition-all text-sm"
              />
              {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <input
                type="tel"
                autoComplete="tel"
                {...register('phone')}
                placeholder={isAr ? '+20 100 0000 000' : '+1 555 000 0000'}
                className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-b border-gray-200lue-600 transition-all text-sm"
              />
              {errors.phone && <p className="mt-1 text-xs font-medium text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'كلمة المرور' : 'Password'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  placeholder={isAr ? '8 أحرف على الأقل' : 'At least 8 characters'}
                  className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-b border-gray-200lue-600 transition-all text-sm pe-12"
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
              {errors.password && <p className="mt-1 text-xs font-medium text-red-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  placeholder={isAr ? 'أعد كتابة كلمة المرور' : 'Re-enter your password'}
                  className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-b border-gray-200lue-600 transition-all text-sm pe-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs font-medium text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 mt-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>{isAr ? 'جاري إنشاء الحساب...' : 'Creating account...'}</span>
                </>
              ) : (
                <span>{isAr ? 'إنشاء الحساب' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
              <Link href={`/${locale}/login`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold hover:underline transition-colors">
                {isAr ? 'تسجيل الدخول' : 'Sign In'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
