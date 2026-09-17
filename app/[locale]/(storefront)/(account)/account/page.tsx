import { getCustomerProfile } from '@/app/actions/customer/profile';
import Link from 'next/link';
import { User, MapPin, ShoppingBag, Lock, ChevronRight, CheckCircle } from 'lucide-react';

export default async function AccountOverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const profile = await getCustomerProfile();

  const quickLinks = [
    { href: `/${locale}/account/profile`, icon: User, labelEn: 'Edit Profile', labelAr: 'تعديل الملف الشخصي', descEn: 'Update your name, phone, and photo', descAr: 'حدّث اسمك ورقم هاتفك وصورتك' },
    { href: `/${locale}/account/orders`, icon: ShoppingBag, labelEn: 'My Orders', labelAr: 'طلباتي', descEn: 'View your order history', descAr: 'عرض سجل طلباتك' },
    { href: `/${locale}/account/addresses`, icon: MapPin, labelEn: 'Addresses', labelAr: 'العناوين', descEn: 'Manage your delivery addresses', descAr: 'إدارة عناوين التوصيل' },
    { href: `/${locale}/account/security`, icon: Lock, labelEn: 'Security', labelAr: 'الأمان', descEn: 'Change your password', descAr: 'تغيير كلمة المرور' },
  ];

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Welcome Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4">          
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isAr ? `مرحباً، ${profile.name}` : `Hello, ${profile.name}`}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{profile.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-green-600 font-medium">
                {isAr ? 'حساب موثّق' : 'Verified Account'}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">{isAr ? 'الهاتف' : 'Phone'}</p>
            <p className="font-medium text-gray-800">{profile.phone || (isAr ? 'غير محدد' : 'Not set')}</p>
          </div>
          <div>
            <p className="text-gray-500">{isAr ? 'تاريخ الانضمام' : 'Member Since'}</p>
            <p className="font-medium text-gray-800">{new Date(profile.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long' })}</p>
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:border-b border-gray-200lue-200 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <link.icon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{isAr ? link.labelAr : link.labelEn}</p>
              <p className="text-xs text-gray-500 mt-0.5">{isAr ? link.descAr : link.descEn}</p>
            </div>
            <ChevronRight className={`w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors ${isAr ? 'rotate-180' : ''}`} />
          </Link>
        ))}
      </div>
    </div>
  );
}
