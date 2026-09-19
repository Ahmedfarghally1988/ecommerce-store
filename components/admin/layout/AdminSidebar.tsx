"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  Settings, 
  Image as ImageIcon,
  Ticket,
  Sliders,
  LogOut,
  Shield,
  Building2,
  Mail,
  Megaphone,
  MessageSquare,
  ArrowRightLeft,
  FileText,
  Menu,
  Banknote,
  Globe,
  Inbox,
  Truck
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  permission?: string;   // required permission (undefined = always show)
  hasPending?: boolean;
}

const navigation: NavItem[] = [
  { name: 'الرئيسية',        href: '/admin',              icon: LayoutDashboard, permission: 'dashboard.view' },
  { name: 'المستخدمين',         href: '/admin/admin-users',  icon: Shield,          permission: 'admin_users.view' },
  { name: 'الإعلانات',       href: '/admin/banners',      icon: Megaphone,       permission: 'banners.view' },
  { name: 'سلايدر العروض',  href: '/admin/sliders',      icon: Sliders,         permission: 'sliders.view' },
  { name: 'المنتجات',        href: '/admin/products',     icon: Package,         permission: 'products.view' },
  { name: 'الأقسام',         href: '/admin/categories',   icon: Tags,            permission: 'categories.view' },
  { name: 'الماركات',        href: '/admin/brands',       icon: Building2,       permission: 'brands.view' },
  { name: 'الطلبات',         href: '/admin/orders',       icon: ShoppingCart,    permission: 'orders.view' },
  { name: 'العملاء',         href: '/admin/customers',    icon: Users,           permission: 'customers.view', hasPending: true },
  { name: 'الكوبونات',       href: '/admin/coupons',      icon: Ticket,          permission: 'coupons.view' },
  { name: 'التقييمات',       href: '/admin/reviews',      icon: MessageSquare,   permission: 'reviews.view' },
  { name: 'الرسائل',         href: '/admin/messages',     icon: Inbox,           permission: 'settings.view' },
  { name: 'الوسائط',         href: '/admin/media',        icon: ImageIcon,       permission: 'media.view' },  
  { name: 'النشرة البريدية',   href: '/admin/newsletter',   icon: Mail,            permission: 'newsletter.view' },
  { name: 'الشحن والتوصيل', href: '/admin/shipping',     icon: Truck,           permission: 'settings.view' },
  { name: 'الدول',           href: '/admin/countries',    icon: Globe,           permission: 'settings.view' },
  { name: 'العملات',         href: '/admin/currencies',   icon: Banknote,        permission: 'settings.view' },
  { name: 'تحويل الروابط',     href: '/admin/redirects',    icon: ArrowRightLeft,  permission: 'settings.view' },
  { name: 'ملف Robots.txt',   href: '/admin/robots',       icon: FileText,        permission: 'settings.view' },
  { name: 'الإعدادات',       href: '/admin/settings',     icon: Settings,        permission: 'settings.view' },
];

interface AdminSidebarProps {
  pendingCustomers?: number;
  adminPermissions?: string[];  // list of permissions, or ['*'] for SUPER_ADMIN
  adminRole?: string;
  onMobileClose?: () => void;
}

function canSee(permission: string | undefined, adminPermissions: string[]): boolean {
  if (!permission) return true; // No permission required → always visible
  if (adminPermissions.includes('*')) return true; // SUPER_ADMIN
  return adminPermissions.includes(permission);
}

export function AdminSidebar({
  pendingCustomers = 0,
  adminPermissions = [],
  adminRole = '',
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const locale = pathname.split('/')[1] || 'en';
  const getLocalizedPath = (href: string) => `/${locale}${href}`;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}/admin/login`);
    router.refresh();
  };

  const visibleNav = navigation.filter(item => canSee(item.permission, adminPermissions));

  return (
    <div className={`flex h-full flex-col bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`flex h-16 shrink-0 items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4'} border-b border-gray-800`}>
        {!isCollapsed && <span className="text-lg font-bold px-2">لوحة التحكم</span>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="hidden md:block p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title={isCollapsed ? "توسيع" : "طي القائمة"}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Admin role badge */}
      {adminRole && !isCollapsed && (
        <div className="px-4 py-2 border-b border-gray-800">
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            adminRole === 'SUPER_ADMIN'
              ? 'bg-purple-900 text-purple-300'
              : 'bg-blue-900 text-blue-300'
          }`}>
            <Shield className="w-3 h-3" />
            {adminRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
          </span>
        </div>
      )}
      
      {adminRole && isCollapsed && (
         <div className="flex justify-center py-2 border-b border-gray-800">
           <Shield className={`w-4 h-4 ${adminRole === 'SUPER_ADMIN' ? 'text-purple-300' : 'text-blue-300'}`} />
         </div>
      )}

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
        {visibleNav.map((item) => {
          const itemPath = getLocalizedPath(item.href);
          const isActive = pathname === itemPath || pathname.startsWith(`${itemPath}/`);
          
          return (
            <Link
              key={item.name}
              href={itemPath}
              onClick={onMobileClose}
              title={isCollapsed ? item.name : undefined}
              className={`group flex items-center rounded-md py-2 transition-colors ${
                isCollapsed ? 'justify-center px-0' : 'px-3'
              } ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon
                className={`h-5 w-5 shrink-0 ${!isCollapsed && 'mr-3 rtl:ml-3 rtl:mr-0'} ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}
                aria-hidden="true"
              />
              {!isCollapsed && <span className="flex-1">{item.name}</span>}
              {!isCollapsed && item.hasPending && pendingCustomers > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
                  {pendingCustomers}
                </span>
              )}
              {isCollapsed && item.hasPending && pendingCustomers > 0 && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-800 px-3 py-3">
        <button
          onClick={handleLogout}
          title={isCollapsed ? "تسجيل الخروج" : undefined}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'} py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors`}
        >
          <LogOut className="w-5 h-5 text-gray-400" />
          {!isCollapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );
}
