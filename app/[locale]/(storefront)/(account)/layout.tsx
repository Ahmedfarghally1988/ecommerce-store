import React from 'react';
import { getCustomerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AccountSidebar from '@/components/storefront/account/AccountSidebar';
import Breadcrumb from '@/components/storefront/Breadcrumb';

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getCustomerSession();

  if (!session || session.role !== 'CUSTOMER' || session.customerStatus !== 'APPROVED') {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: locale === 'ar' ? 'حسابي' : 'My Account' }]} locale={locale} />
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <AccountSidebar 
              locale={locale} 
              customerName={session.name || session.email} 
              customerAvatar={session.avatar || null} 
            />
          </aside>
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
