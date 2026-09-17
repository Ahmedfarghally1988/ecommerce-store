import prisma from '@/lib/prisma';
import StorefrontHeader from '@/components/storefront/layout/StorefrontHeader';
import StorefrontFooter from '@/components/storefront/layout/StorefrontFooter';
import { VisitorTracker } from '@/components/storefront/VisitorTracker';
import { getCustomerSession } from '@/lib/auth';
import { getActiveCurrencies, getCustomerCurrency, getCustomerCountry } from '@/lib/currency';
import React from 'react';



export default async function StorefrontLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const customerSession = await getCustomerSession();

  const customer = customerSession?.role === 'CUSTOMER' && customerSession?.customerStatus === 'APPROVED'
    ? { name: customerSession.name || customerSession.email, email: customerSession.email, avatar: customerSession.avatar }
    : null;

  const [activeCurrenciesData, customerCurrency, customerCountryData] = await Promise.all([
    getActiveCurrencies(),
    getCustomerCurrency(),
    getCustomerCountry()
  ]);

  const activeCountriesData = await prisma.country.findMany({
    where: { isActive: true },
    include: { currency: true },
    orderBy: { createdAt: 'asc' }
  });

  // Convert Decimal to number for Client Components
  const activeCurrencies = activeCurrenciesData.map(c => ({
    ...c,
    exchangeRate: Number(c.exchangeRate)
  }));

  const activeCountries = activeCountriesData.map(c => ({
    ...c,
    currency: c.currency ? {
      ...c.currency,
      exchangeRate: Number(c.currency.exchangeRate)
    } : null
  }));

  const customerCountry = customerCountryData ? {
    ...customerCountryData,
    currency: customerCountryData.currency ? {
      ...customerCountryData.currency,
      exchangeRate: Number(customerCountryData.currency.exchangeRate)
    } : null
  } : null;


  // Fetch store settings for header info
  let storeSettings: Record<string, string> = {};
  let headerCategories: any[] = [];
  let footerCategories: any[] = [];
  
  try {
    const [settings, categories] = await Promise.all([
      prisma.setting.findMany(),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, nameEn: true, nameAr: true, slug: true, showInHeader: true, showInFooter: true }
      })
    ]);
    storeSettings = Object.fromEntries(settings.map(s => [s.key, s.value]));
    
    headerCategories = categories.filter(c => c.showInHeader);
    footerCategories = categories.filter(c => c.showInFooter);
  } catch {
    // use defaults
  }

  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontHeader 
        locale={locale} 
        customer={customer} 
        storeSettings={storeSettings} 
        categories={headerCategories} 
        currencies={activeCurrencies}
        currentCurrency={customerCurrency?.code || 'EGP'}
        countries={activeCountries}
        currentCountryCode={customerCountry?.code || ''}
      />
      <main className="flex-1 flex flex-col">
        <VisitorTracker />
        {children}
      </main>
      <StorefrontFooter locale={locale} categories={footerCategories} storeSettings={storeSettings} />
    </div>
  );
}
