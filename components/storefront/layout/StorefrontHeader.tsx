"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import CountrySelector from './CountrySelector';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ShoppingCart, Search, Menu, X, User, LogOut, Package,
  MapPin, ChevronDown, Phone, Mail, Facebook, Instagram,
  Twitter, MessageCircle, Video, Link as LinkIcon, Youtube, Linkedin, Github, Headphones,
  LogIn, Home, Globe, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface CustomerInfo {
  name: string;
  email: string;
  avatar?: string | null;
}

interface StorefrontHeaderProps {
  locale: string;
  customer: CustomerInfo | null;
  storeSettings?: Record<string, string>;
  categories?: { id: string; nameEn: string; nameAr: string; slug: string }[];
  currencies?: any[];
  currentCurrency?: string;
  countries?: any[];
  currentCountryCode?: string;
}

const getSocialIcon = (name: string, url: string) => {
  const lowerName = name.toLowerCase();
  const lowerUrl = url.toLowerCase();

  if (lowerName.includes('facebook') || lowerName.includes('فيسبوك') || lowerUrl.includes('facebook.com')) {
    return <Facebook className="w-3.5 h-3.5" />;
  }
  if (lowerName.includes('instagram') || lowerName.includes('انستجرام') || lowerName.includes('إنستجرام') || lowerUrl.includes('instagram.com')) {
    return <Instagram className="w-3.5 h-3.5" />;
  }
  if (lowerName.includes('twitter') || lowerName.includes('تويتر') || lowerName.includes('x') || lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return <Twitter className="w-3.5 h-3.5" />;
  }
  if (lowerName.includes('tiktok') || lowerName.includes('تيك توك') || lowerUrl.includes('tiktok.com')) {
    return <Video className="w-3.5 h-3.5" />;
  }
  if (lowerName.includes('youtube') || lowerName.includes('يوتيوب') || lowerUrl.includes('youtube.com')) {
    return <Youtube className="w-3.5 h-3.5" />;
  }
  if (lowerName.includes('linkedin') || lowerName.includes('لينكد') || lowerUrl.includes('linkedin.com')) {
    return <Linkedin className="w-3.5 h-3.5" />;
  }
  if (lowerName.includes('github') || lowerName.includes('جيت هاب') || lowerUrl.includes('github.com')) {
    return <Github className="w-3.5 h-3.5" />;
  }
  return <LinkIcon className="w-3.5 h-3.5" />;
};

export default function StorefrontHeader({ locale, customer, storeSettings = {}, categories = [], currencies = [], currentCurrency = 'EGP', countries = [], currentCountryCode = '' }: StorefrontHeaderProps) {
  const t = useTranslations('Storefront');
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, isMounted } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const storeName = storeSettings['store_name'] || 'متجرنا';
  const storePhone = storeSettings['contact_phone'] || storeSettings['phone'] || '';
  const storeEmail = storeSettings['contact_email'] || storeSettings['email'] || '';
  const storeLogo = storeSettings['logo'] || '';
  const storeAddress = storeSettings['address'] || '';
  const whatsappNumber = storeSettings['whatsapp'] || storePhone;
  const headerTaglineAr = storeSettings['header_tagline_ar'] || 'شحن سريع | أفضل الأسعار | ضمان الجودة';
  const headerTaglineEn = storeSettings['header_tagline_en'] || 'Fast Shipping | Best Prices | Quality Guaranteed';
  const headerTagline = locale === 'ar' ? headerTaglineAr : headerTaglineEn;

  let customSocialLinks: any[] = [];
  try {
    if (storeSettings['custom_social_links']) {
      customSocialLinks = JSON.parse(storeSettings['custom_social_links']);
    }
  } catch(e) {}

  const switchLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(newPath || `/${nextLocale}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/products?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/customer-logout', { method: 'POST' });
    router.push(`/${locale}`);
    router.refresh();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change or ESC key
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isRtl = locale === 'ar';

  const navLinks: { label: string; href: string; icon?: any }[] = [
   {
    label: locale === 'ar' ? 'الرئيسية' : 'Home',
    href: `/${locale}`,
    icon: Home,
  },  
    ...categories.map(cat => ({
      label: locale === 'ar' ? cat.nameAr : cat.nameEn,
      href: `/${locale}/category/${cat.slug}`
    }))
  ];

  return (
    <header className="sticky -top-9 md:static md:top-auto z-50 w-full flex flex-col">
      {/* ── Top Bar ── */}
      <div className="bg-gray-900 text-gray-200 text-xs">
        <div className="container mx-auto px-4 h-9 flex items-center justify-between gap-2">
          {/* Left: contact info */}
          <div className="flex items-center gap-4 min-w-0">
            {storePhone && (
              <a
                href={`tel:${storePhone}`}
                className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span dir="ltr">{storePhone}</span>
              </a>
            )}
            {storeEmail && (
              <a
                href={`mailto:${storeEmail}`}
                className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors min-w-0"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{storeEmail}</span>
              </a>
            )}
          </div>

          {/* Center: tagline (hidden on small screens) */}
          <p className="hidden lg:block text-center text-[11px] text-gray-400 flex-1 truncate px-4">
            {headerTagline}
          </p>

          {/* Right: social + language */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
              )}
              {customSocialLinks.map((link: any) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" title={link.name}>
                  {getSocialIcon(link.name, link.url)}
                </a>
              ))}
            </div>
            {countries.length > 0 && (
              <CountrySelector countries={countries} currentCountryCode={currentCountryCode} locale={locale} />
            )}

            <span className="w-px h-3 bg-gray-700 mx-1" />

            <button
              onClick={switchLanguage}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded hover:bg-gray-800 hover:text-white transition-colors tracking-wider"
              title="تغيير اللغة / Change Language"
            >              
              <span>{locale === 'en' ? 'AR' : 'EN'}</span>
              <Globe className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <div className={`bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Mobile menu toggle + Logo */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 -ml-2 rtl:-mr-2 rtl:ml-0 text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
              {storeLogo ? (
                <img src={storeLogo} alt={storeName} className="h-9 md:h-12 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow">
                    <span className="text-white font-black text-sm">
                      {storeName.charAt(0)}
                    </span>
                  </div>
                  <span className="text-xl font-black tracking-tight text-gray-900">
                    {storeName}
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative mx-4">
            <input
              type="text"
              placeholder={locale === 'ar' ? 'ابحث عن منتج...' : 'Search products...'}
              className="w-full ps-4 pe-12 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:bg-white focus:border-b border-gray-200lue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute end-1 top-1 bottom-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex items-center"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">

            {/* Cart */}
            <Link href={`/${locale}/cart`} className="relative flex items-center text-sm gap-1 sm:gap-2 p-2 font-bold">
              <ShoppingCart size={21} /> <span className="hidden md:inline">{locale === 'ar' ? 'السلة' : 'Cart'}</span>
              {isMounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -start-0.5 bg-blue-600 text-white text-[10px] font-bold h-4 min-w-4 px-0.5 rounded-full flex items-center justify-center leading-none">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {customer ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 py-1.5 transition-colors text-sm font-medium text-gray-800"
                >
                  {customer.avatar ? (
                    <img src={customer.avatar} alt={customer.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {customer.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block max-w-[80px] truncate">{customer.name.split(' ')[0]}</span>
                  <ChevronDown size={13} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute end-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-200 border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm truncate">{customer.name}</p>
                      <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                    </div>
                    <Link href={`/${locale}/account`} onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User className="w-4 h-4 text-gray-400" />
                      {locale === 'ar' ? 'حسابي' : 'My Account'}
                    </Link>
                    <Link href={`/${locale}/account/orders`} onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Package className="w-4 h-4 text-gray-400" />
                      {locale === 'ar' ? 'طلباتي' : 'My Orders'}
                    </Link>
                    <Link href={`/${locale}/account/addresses`} onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {locale === 'ar' ? 'عناويني' : 'Addresses'}
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" />
                        {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link href={`/${locale}/login`} className="hidden sm:flex gap-1 sm:gap-2 p-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-semibold py-1.5">
                  <LogIn size={20} /> {locale === 'ar' ? 'دخول' : 'Login'}
                </Link>
                <Link href={`/${locale}/register`} className="hidden sm:flex gap-1 sm:gap-2 p-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-semibold py-1.5">
                  <User size={20} />{locale === 'ar' ? 'إنشاء حساب' : 'Register'}
                </Link>                
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* ── Desktop Nav Bar ── */}
      <div className="hidden md:block bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== `/${locale}` && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? ' text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 shrink-0" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
            <Link 
              href={`/${locale}/contact`} 
              className="flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-bold transition-colors shadow-sm"
            >
              <Headphones className="w-4 h-4" />
              <span>{locale === 'ar' ? 'اتصل بنا' : 'CONTACT US'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile Side Drawer Menu (Slide from side based on language) ── */}
      {/* 1. Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* 2. Side Drawer Panel */}
      <div
        className={`fixed top-0 bottom-0 z-50 w-[85%] max-w-[340px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isRtl ? 'right-0' : 'left-0'
        } ${
          isMobileMenuOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full'
            : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-200 border-gray-100 flex items-center justify-between bg-gray-50/70">
          <Link
            href={`/${locale}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5"
          >
            {storeLogo ? (
              <img src={storeLogo} alt={storeName} className="h-9 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-sm">
                  <span className="text-white font-black text-sm">
                    {storeName.charAt(0)}
                  </span>
                </div>
                <span className="text-lg font-black tracking-tight text-gray-900">
                  {storeName}
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors shadow-sm"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar inside Drawer */}
        <div className="p-4 border-b border-gray-200 border-gray-100 bg-white">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder={locale === 'ar' ? 'ابحث عن منتج...' : 'Search products...'}
              className="w-full ps-4 pe-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-b border-gray-200lue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute end-1.5 top-1.5 bottom-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
            >
              <Search size={15} />
            </button>
          </form>
        </div>

        {countries.length > 0 && (
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-600">{locale === 'ar' ? 'البلد' : 'Country'}</span>
            <CountrySelector countries={countries} currentCountryCode={currentCountryCode} locale={locale} />
          </div>
        )}

        {/* Scrollable Nav Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          
          {/* Main Links */}
          <div className="space-y-1">
            <Link
              href={`/${locale}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === `/${locale}`
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-blue-600" />
                <span>{locale === 'ar' ? 'الرئيسية' : 'Home'}</span>
              </div>
              {isRtl ? <ChevronLeft className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </Link>


          </div>

          {/* Categories Section */}
          {categories.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {locale === 'ar' ? 'الأقسام' : 'Categories'}
                </span>
                <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {categories.length}
                </span>
              </div>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const isActive = pathname === `/${locale}/category/${cat.slug}`;
                  return (
                    <Link
                      key={cat.id}
                      href={`/${locale}/category/${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{locale === 'ar' ? cat.nameAr : cat.nameEn}</span>
                      {isRtl ? <ChevronLeft className="w-3.5 h-3.5 text-gray-300" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Support / Contact link */}
          <div className="pt-2 border-t border-gray-100">
            <Link
              href={`/${locale}/contact`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Headphones className="w-4 h-4 text-blue-600" />
                <span>{locale === 'ar' ? 'اتصل بنا / الدعم' : 'Contact Us / Support'}</span>
              </div>
              {isRtl ? <ChevronLeft className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </Link>
          </div>

          {/* Language Switcher Button */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => {
                switchLanguage();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-gray-500" />
                <span>{locale === 'ar' ? 'اللغة / Language' : 'Language / اللغة'}</span>
              </div>
              <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-[11px] font-bold text-blue-600 shadow-sm">
                {locale === 'ar' ? 'EN' : 'AR'}
              </span>
            </button>
          </div>

        </div>

        {/* User Profile / Auth Section in Drawer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/60">
          {customer ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-200/80 shadow-sm">
                {customer.avatar ? (
                  <img src={customer.avatar} alt={customer.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {customer.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900 truncate">{customer.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{customer.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href={`/${locale}/account`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  <span>{locale === 'ar' ? 'حسابي' : 'Account'}</span>
                </Link>
                <Link
                  href={`/${locale}/account/orders`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                >
                  <Package className="w-3.5 h-3.5 text-gray-500" />
                  <span>{locale === 'ar' ? 'طلباتي' : 'Orders'}</span>
                </Link>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Link
                  href={`/${locale}/login`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center text-xs font-bold border border-gray-300 text-gray-800 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm"
                >
                  {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm shadow-blue-500/20"
                >
                  {locale === 'ar' ? 'إنشاء حساب' : 'Register'}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer with Quick Contact & Socials */}
        {(storePhone || whatsappNumber || customSocialLinks.length > 0) && (
          <div className="p-3 bg-gray-900 text-white border-t border-gray-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white transition-colors flex items-center gap-1.5 px-2.5 font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{locale === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                </a>
              )}
              {storePhone && (
                <a
                  href={`tel:${storePhone}`}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200 transition-colors flex items-center gap-1 px-2"
                  dir="ltr"
                >
                  <Phone className="w-3 h-3" />
                </a>
              )}
            </div>

            {customSocialLinks.length > 0 && (
              <div className="flex items-center gap-1">
                {customSocialLinks.slice(0, 3).map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                  >
                    {getSocialIcon(s.name, s.url)}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
}
