"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Mail, Phone, MapPin, ShieldCheck, ArrowUp, Facebook,
  Instagram, Twitter, Video, Youtube, Linkedin, Github,
  Link as LinkIcon, MessageCircle, Clock, ChevronRight, ChevronLeft
} from 'lucide-react';

interface StorefrontFooterProps {
  locale: string;
  categories?: { id: string; nameEn: string; nameAr: string; slug: string }[];
  storeSettings?: Record<string, string>;
}

const getSocialIcon = (name: string, url: string) => {
  const lowerName = name.toLowerCase();
  const lowerUrl = url.toLowerCase();

  if (lowerName.includes('facebook') || lowerName.includes('فيسبوك') || lowerUrl.includes('facebook.com')) {
    return <Facebook className="w-4 h-4" />;
  }
  if (lowerName.includes('instagram') || lowerName.includes('انستجرام') || lowerName.includes('إنستجرام') || lowerUrl.includes('instagram.com')) {
    return <Instagram className="w-4 h-4" />;
  }
  if (lowerName.includes('twitter') || lowerName.includes('تويتر') || lowerName.includes('x') || lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return <Twitter className="w-4 h-4" />;
  }
  if (lowerName.includes('tiktok') || lowerName.includes('تيك توك') || lowerUrl.includes('tiktok.com')) {
    return <Video className="w-4 h-4" />;
  }
  if (lowerName.includes('youtube') || lowerName.includes('يوتيوب') || lowerUrl.includes('youtube.com')) {
    return <Youtube className="w-4 h-4" />;
  }
  if (lowerName.includes('linkedin') || lowerName.includes('لينكد') || lowerUrl.includes('linkedin.com')) {
    return <Linkedin className="w-4 h-4" />;
  }
  if (lowerName.includes('github') || lowerName.includes('جيت هاب') || lowerUrl.includes('github.com')) {
    return <Github className="w-4 h-4" />;
  }
  if (lowerName.includes('whatsapp') || lowerName.includes('واتساب') || lowerUrl.includes('wa.me')) {
    return <MessageCircle className="w-4 h-4" />;
  }
  return <LinkIcon className="w-4 h-4" />;
};

export default function StorefrontFooter({ locale, categories = [], storeSettings = {} }: StorefrontFooterProps) {
  const t = useTranslations('Storefront');
  const tPolicies = useTranslations('Policies');

  // Settings values
  const storeName = storeSettings['store_name'] || 'متجرنا';
  const storePhone = storeSettings['contact_phone'] || storeSettings['phone'] || '';
  const storeEmail = storeSettings['contact_email'] || storeSettings['email'] || '';
  const storeAddress = storeSettings['address'] || '';
  const whatsappNumber = storeSettings['whatsapp'] || storePhone;
  
  // Footer logo with fallback to main logo
  const footerLogo = storeSettings['footer_logo'] || storeSettings['logo'] || '';

  // Custom social links
  let customSocialLinks: Array<{ id: string; name: string; url: string }> = [];
  try {
    if (storeSettings['custom_social_links']) {
      customSocialLinks = JSON.parse(storeSettings['custom_social_links']);
    }
  } catch (e) {
    customSocialLinks = [];
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isRtl = locale === 'ar';
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <footer className="mt-auto flex flex-col">
      {/* ═══════════════════════════════════════════════════════
          MAIN FOOTER (bg-gray-900 matching Top Bar)
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            
            {/* ── Column 1: Store Brand & Contact Info (span 4) ── */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Logo container with dark background (bg-gray-900) */}
              <Link href={`/${locale}`} className="inline-flex items-center gap-3 group">
                {footerLogo ? (
                  <div className="h-14 flex items-center bg-gray-900 rounded-xl">
                    <img
                      src={footerLogo}
                      alt={storeName}
                      className="max-h-12 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                      <span className="text-white font-black text-xl">
                        {storeName.charAt(0)}
                      </span>
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                      {storeName}
                    </span>
                  </div>
                )}
              </Link>

              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                {locale === 'ar'
                  ? 'وجهتكم الأولى للتسوق الممتع والموثوق. نقدم باقة مميزة من أفضل المنتجات المختارة بعناية لتلبي كافة تطلعاتكم مع تجربة دفع آمنة وتوصيل فوري.'
                  : 'Your premier destination for trusted online shopping. Offering curated high-quality products, secure payment, and fast doorstep delivery.'}
              </p>
              {/* Social Media Links */}
              {customSocialLinks.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                    {locale === 'ar' ? 'تابعنا على' : 'Follow Us'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {customSocialLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.name}
                        title={link.name}
                        className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                      >
                        {getSocialIcon(link.name, link.url)}
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* ── Column 2: Categories (span 3) ── */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-base font-bold text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-10 after:h-0.5 after:bg-blue-500 rounded-full">
                {locale === 'ar' ? 'أقسام المتجر' : 'Shop Categories'}
              </h3>
              
              {categories.length > 0 ? (
                <ul className="space-y-2.5 text-sm">
                  {categories.slice(0, 7).map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/${locale}/category/${cat.slug}`}
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group py-1"
                      >
                        <ArrowIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                        <span className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">
                          {locale === 'ar' ? cat.nameAr : cat.nameEn}
                        </span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={`/${locale}/products`}
                      className="text-blue-400 hover:text-blue-300 font-medium text-xs flex items-center gap-1.5 pt-2"
                    >
                      <span>{locale === 'ar' ? 'عرض جميع الأقسام والمنتجات' : 'Browse all products'}</span>
                      <ArrowIcon className="w-3 h-3" />
                    </Link>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link href={`/${locale}/products`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                      <ArrowIcon className="w-3.5 h-3.5 text-gray-500" />
                      <span>{locale === 'ar' ? 'كافة المنتجات' : 'All Products'}</span>
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* ── Column 3: Quick Links (span 2) ── */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-10 after:h-0.5 after:bg-blue-500 rounded-full">
                {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href={`/${locale}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group py-1">
                    <ArrowIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400" />
                    <span>{locale === 'ar' ? 'الرئيسية' : 'Home'}</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/contact`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group py-1">
                    <ArrowIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400" />
                    <span>{locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/products`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group py-1">
                    <ArrowIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400" />
                    <span>{locale === 'ar' ? 'المنتجات' : 'Products'}</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/cart`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group py-1">
                    <ArrowIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400" />
                    <span>{locale === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/login`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group py-1">
                    <ArrowIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400" />
                    <span>{locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/register`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group py-1">
                    <ArrowIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400" />
                    <span>{locale === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* ── Column 4: Customer Service & Guarantee (span 3) ── */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-base font-bold text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-10 after:h-0.5 after:bg-blue-500 rounded-full">
                {locale === 'ar' ? 'خدمة العملاء والضمان' : 'Support & Guarantee'}
              </h3>
              
              <div className="bg-gray-800/60 border border-gray-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-b border-gray-200lue-500/20">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {locale === 'ar' ? 'ساعات العمل' : 'Business Hours'}
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      {locale === 'ar' ? 'يومياً من 9:00 ص إلى 11:00 م' : 'Daily 9:00 AM - 11:00 PM'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-700/60 pt-3">
                  <p className="text-xs text-gray-300 leading-relaxed mb-3">
                    {locale === 'ar' 
                      ? 'هل لديك استفسار أو بحاجة للمساعدة في طلبك؟' 
                      : 'Have questions or need help with your order?'}
                  </p>
                  {whatsappNumber && (
                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{locale === 'ar' ? 'محادثة فورية مع الدعم' : 'Live Chat Support'}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Trust highlight */}
              <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{locale === 'ar' ? 'تسوق آمن ومحمي بأعلى معايير الأمان' : 'Secure and encrypted checkout'}</span>
              </div>
            </div>

          </div>

          {/* ── Bottom Bar: Copyright & Payment Badges ── */}
          <div className="mt-14 pt-4 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <p className="text-center sm:text-start">
              &copy; {new Date().getFullYear()} <span className="text-white font-semibold">{storeName}</span>. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>           

            {/* Scroll to Top button */}
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all hover:scale-105"
            >
              <ArrowUp className="w-4 h-4" />
            </button>

             {/* Policy Links & Payment Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-3 border-r rtl:border-r-0 rtl:border-l border-gray-700 px-3">
                <Link href={`/${locale}/privacy-policy`} className="hover:text-white transition-colors">{tPolicies('privacyPolicy')}</Link>
                <Link href={`/${locale}/terms-of-use`} className="hover:text-white transition-colors">{tPolicies('termsOfUse')}</Link>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400 hidden md:inline">
                  {locale === 'ar' ? 'طرق الدفع المتاحة:' : 'Accepted Payments:'}
                </span>                          
                <div className="px-2.5 py-1 bg-gray-800/90 rounded-md border border-gray-700/70 text-[11px] font-medium text-gray-300">
                  {locale === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
