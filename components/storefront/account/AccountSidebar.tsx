"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  MapPin,
  Lock,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface AccountSidebarProps {
  locale: string;
  customerName: string;
  customerAvatar?: string | null;
}

export default function AccountSidebar({ locale, customerName, customerAvatar }: AccountSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAr = locale === 'ar';

  const navItems = [
    { href: `/${locale}/account`, icon: LayoutDashboard, labelEn: 'Overview', labelAr: 'نظرة عامة', exact: true },
    { href: `/${locale}/account/profile`, icon: User, labelEn: 'My Profile', labelAr: 'ملفي الشخصي', exact: false },
    { href: `/${locale}/account/orders`, icon: ShoppingBag, labelEn: 'My Orders', labelAr: 'طلباتي', exact: false },
    { href: `/${locale}/account/addresses`, icon: MapPin, labelEn: 'Addresses', labelAr: 'عناويني', exact: false },
    { href: `/${locale}/account/security`, icon: Lock, labelEn: 'Security', labelAr: 'الأمان', exact: false },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/customer-logout', { method: 'POST' });
    router.push(`/${locale}/login`);
    router.refresh();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Profile Header */}
      <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold mb-2 overflow-hidden shadow-inner">
          {customerAvatar ? (
            <img src={customerAvatar} alt={customerName} className="w-full h-full object-cover" />
          ) : (
            customerName?.charAt(0)?.toUpperCase() || 'U'
          )}
        </div>
        <p className="font-semibold text-sm truncate">{customerName}</p>
        <p className="text-blue-200 text-xs mt-0.5">{isAr ? 'عميل' : 'Customer'}</p>
      </div>

      {/* Navigation */}
      <nav className="p-2" dir={isAr ? 'rtl' : 'ltr'}>
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className="flex-1">{isAr ? item.labelAr : item.labelEn}</span>
              <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isAr ? 'rotate-180' : ''}`} />
            </Link>
          );
        })}

        <div className="border-t border-gray-100 mt-2 pt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
