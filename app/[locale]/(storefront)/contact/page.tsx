import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import { ContactClient } from './ContactClient';
import Breadcrumb from '@/components/storefront/Breadcrumb';

export const metadata: Metadata = {
  title: 'اتصل بنا | Contact Us',
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const settingsRecords = await prisma.setting.findMany({
    where: {
      key: {
        in: ['contact_email', 'contact_phone', 'whatsapp', 'address', 'store_location_map']
      }
    }
  });

  const settings = settingsRecords.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const t = await getTranslations({ locale, namespace: 'Contact' });

  const breadcrumbItems = [
    { label: t('title'), href: `/${locale}/contact` },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} locale={locale} />
      
      <div className="text-center mb-12 mt-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          {t('description')}
        </p>
      </div>
      
      <ContactClient settings={settings} locale={locale} />
    </div>
  );
}
