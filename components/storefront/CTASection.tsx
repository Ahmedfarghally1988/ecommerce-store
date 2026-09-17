import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function CTASection({ locale }: { locale: string }) {
  const isAr = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'Storefront' });
  
  return (
    <section 
      className="relative w-full bg-gray-900 my-6 py-24 bg-cover bg-center overflow-hidden" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-[#1e232a]/85"></div>
      <div className="container mx-auto px-4 relative z-10 text-center text-white">
        <div className="flex items-center justify-center gap-3 mb-4 text-xl md:text-2xl font-medium tracking-wide italic font-serif">
          <span>{t('ctaSubTitle')}</span>
          <span className="text-[#3b82f6] flex items-center gap-1 font-bold not-italic">
            <Star className="w-4 h-4 text-[#3b82f6]" strokeWidth={2.5} />
            {t('ctaDiscount')}
            <Star className="w-4 h-4 text-[#3b82f6]" strokeWidth={2.5} />
          </span>
          <span>{t('ctaOnline')}</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight drop-shadow-md">
          {t('ctaTitle')}
        </h2>
        
        <p className="text-gray-300 mb-10 text-lg font-medium">
          {t('ctaDesc')}
        </p>
        
        <Link 
          href={`/${locale}/products`} 
          className="inline-block px-10 py-4 rounded-md bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold transition-colors text-sm tracking-wider shadow-lg"
        >
          {t('ctaButton')}
        </Link>
      </div>
    </section>
  );
}
