"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/app/actions/auth/reset";
import { useParams } from "next/navigation";
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const isAr = locale === "ar";
  
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const result = await resetPassword(email);
      if (result.success) {
        setStatus("success");
        setMessage(result.message);
      } else {
        setStatus("error");
        setMessage(result.message);
      }
    } catch (err) {
      setStatus("error");
      setMessage(isAr ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Ambient background decoration */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-200/40 dark:bg-blue-950/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-950/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">     
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-300/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30 text-white">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
              {isAr 
                ? 'أدخل بريدك الإلكتروني المسجل لدينا وسنقوم بإرسال كلمة مرور جديدة إليك.' 
                : 'Enter your registered email address and we will send you a new password.'}
            </p>
          </div>

          {status === "success" ? (
            <div className="text-center">
              <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 dark:bg-green-950/40 dark:border-green-900/50 dark:text-green-300 text-sm flex items-center justify-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500" />
                <span className="font-medium text-start">{message}</span>
              </div>
              <Link 
                href={`/${locale}/login`} 
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-blue-600/25 text-sm"
              >
                {isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </Link>
            </div>
          ) : (
            <>
              {status === "error" && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-300 text-sm flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" method="POST">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isAr ? 'أدخل بريدك الإلكتروني' : 'you@example.com'}
                    className="w-full px-4 py-3.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-b border-gray-200 transition-all text-sm"
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 text-sm"
                >
                  {status === "loading" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      <span>{isAr ? 'جاري الإرسال...' : 'Sending...'}</span>
                    </>
                  ) : (
                    <span>{isAr ? 'إرسال كلمة المرور' : 'Send Password'}</span>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <Link href={`/${locale}/login`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold hover:underline transition-colors">
                    {isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
