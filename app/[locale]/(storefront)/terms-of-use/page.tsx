import { getTranslations } from 'next-intl/server';
import Breadcrumb from '@/components/storefront/Breadcrumb';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Policies' });
  
  const titleKey = locale === 'ar' ? 'terms_of_use_title_ar' : 'terms_of_use_title_en';
  const titleSetting = await prisma.setting.findUnique({ where: { key: titleKey } });
  const customTitle = titleSetting?.value;

  return {
    title: customTitle || t('termsOfUse'),
  };
}

export default async function TermsOfUsePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Policies' });
  
  const settingKey = locale === 'ar' ? 'terms_of_use_ar' : 'terms_of_use_en';
  const titleKey = locale === 'ar' ? 'terms_of_use_title_ar' : 'terms_of_use_title_en';
  
  const settings = await prisma.setting.findMany({
    where: { key: { in: [settingKey, titleKey] } }
  });

  const setting = settings.find(s => s.key === settingKey);
  const titleSetting = settings.find(s => s.key === titleKey);

  const content = setting?.value || '';
  const displayTitle = titleSetting?.value || t('termsOfUse');

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <Breadcrumb
          locale={locale}
          items={[{ label: displayTitle, href: '/terms-of-use' }]}
        />
        
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            {displayTitle}
          </h1>
          
          {content ? (
            <div 
              className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed break-words overflow-hidden"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-center text-gray-500 py-10">المحتوى غير متوفر حالياً.</p>
          )}
        </div>
      </div>
    </div>
  );
}
