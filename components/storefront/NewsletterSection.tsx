"use client";

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, ShieldCheck, Truck, Headphones, Sparkles } from 'lucide-react';
import { useToast } from '@/components/shared/ui/Toast';
import { subscribeToNewsletter } from '@/app/actions/storefront/newsletter';

interface NewsletterSectionProps {
  locale: string;
}

export default function NewsletterSection({ locale }: NewsletterSectionProps) {
  const { addToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError('');
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      const msg = locale === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address';
      setNewsletterError(msg);
      addToast({
        title: locale === 'ar' ? 'تنبيه' : 'Notice',
        message: msg,
        type: 'warning'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await subscribeToNewsletter(newsletterEmail);
      setIsSubmitting(false);

      if (res.alreadySubscribed) {
        const msg = locale === 'ar' 
          ? 'هذا البريد الإلكتروني مسجل مسبقاً بالفعل في النشرة البريدية' 
          : 'This email is already subscribed to our newsletter';
        setNewsletterError(msg);
        addToast({
          title: locale === 'ar' ? 'تنبيه' : 'Notice',
          message: msg,
          type: 'warning'
        });
        return;
      }

      if (!res.success) {
        const msg = res.error || (locale === 'ar' ? 'حدث خطأ أثناء الاشتراك' : 'Failed to subscribe');
        setNewsletterError(msg);
        addToast({
          title: locale === 'ar' ? 'خطأ' : 'Error',
          message: msg,
          type: 'error'
        });
        return;
      }

      setIsSubscribed(true);
      setNewsletterError('');
      addToast({
        title: locale === 'ar' ? 'تم الاشتراك بنجاح! 🎉' : 'Subscribed successfully! 🎉',
        message: locale === 'ar' ? 'شكراً لاشتراكك، ستصلك أحدث العروض أولاً بأول' : 'Thank you for subscribing! You will receive our latest offers soon.',
        type: 'success'
      });
      setNewsletterEmail('');
    } catch {
      setIsSubmitting(false);
      const msg = locale === 'ar' ? 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً' : 'An unexpected error occurred';
      setNewsletterError(msg);
      addToast({
        title: locale === 'ar' ? 'خطأ' : 'Error',
        message: msg,
        type: 'error'
      });
    }
  };

  return (
    <section className="container mx-auto rounded-md my-10 px-5 bg-gradient-to-br from-blue-900 via-indigo-950 to-gray-950 text-white relative overflow-hidden border border-indigo-900/40 shadow-xl">
      {/* Decorative background glow circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 py-9 lg:py-12 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
              

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {locale === 'ar' ? (
              <>اشترك في نشرتنا البريدية واحصل على <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">أحدث العروض</span></>
            ) : (
              <>Join our newsletter and get <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Latest Offers</span></>
            )}
          </h2>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {locale === 'ar'
              ? 'كن أول من يعرف عن أحدث المنتجات، العروض الترويجية الحصرية، وقسائم التخفيض الخاصة بمشتركينا.'
              : 'Be the first to hear about new arrivals, flash sales, and exclusive subscriber coupon codes.'}
          </p>



          <div className="w-full max-w-4xl mt-2">
            {isSubscribed ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {locale === 'ar' ? 'شكراً لانضمامك إلينا!' : 'Thank you for joining!'}
                </h3>
                <p className="text-sm text-gray-300">
                  {locale === 'ar' ? 'تفقد بريدك الإلكتروني للحصول على أحدث العروض.' : 'Check your inbox for your latest Offers.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-4 w-full">
                <div className="flex flex-col gap-3">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400">
                      <Mail className="w-6 h-6" />
                    </div>
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (newsletterError) setNewsletterError('');
                      }}
                      placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني...' : 'Enter your email...'}
                      required
                      className={`w-full ps-12 pe-4 py-4 bg-black/40 border rounded-2xl text-white placeholder-gray-400 text-base focus:outline-none focus:ring-2 transition-all ${
                        newsletterError ? 'border-red-400 focus:ring-red-400' : 'border-white/20 focus:ring-blue-400 focus:border-transparent'
                      }`}
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="max-w-sm m-auto py-4 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{locale === 'ar' ? 'اشترك الآن' : 'Subscribe'}</span>
                      </>
                    )}
                  </button>
                </div>

                {newsletterError && (
                  <div className="text-red-300 text-xs flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span>{newsletterError}</span>
                  </div>
                )}

                <p className="text-[11px] text-gray-400 text-center pt-2">
                  {locale === 'ar'
                    ? '🔒 نلتزم بحماية خصوصيتك ولن نرسل لك أي رسائل مزعجة.'
                    : '🔒 We respect your privacy. Unsubscribe at any time.'}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
