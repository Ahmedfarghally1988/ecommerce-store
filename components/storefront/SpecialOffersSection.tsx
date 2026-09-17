import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { getCustomerCurrency } from '@/lib/currency';
import { convertPrice } from '@/lib/currency-utils';
import { getTranslations } from 'next-intl/server';

interface SpecialOffersSectionProps {
  products: any[];
  banner: any;
  locale: string;
}

export default async function SpecialOffersSection({ products, banner, locale }: SpecialOffersSectionProps) {
  const isAr = locale === 'ar';
  const currencyObj = await getCustomerCurrency();
  const currency = currencyObj?.code || 'EGP';
  const exchangeRate = Number(currencyObj?.exchangeRate || 1);
  const t = await getTranslations({ locale, namespace: 'Storefront' });
  
  if (!products || products.length === 0) return null;
  
  const displayProducts = products.slice(0, 6);

  return (
    <section className="py-12 container mx-auto px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">{t('specialOffersTitle')}</h2>
        <p className="text-gray-500 mt-2">
          {t('specialOffersDesc')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Banner (5 columns on large screens) */}
        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden h-[300px] lg:h-auto min-h-[400px] shadow-sm">
          <Image 
            src={banner?.image || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop"} 
            alt={locale === 'ar' ? banner?.titleAr || t('specialOffersTitle') : banner?.titleEn || t('specialOffersTitle')}
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-8">
            <h3 className="text-white text-3xl md:text-4xl font-extrabold mb-3 drop-shadow-lg">
              {locale === 'ar' ? banner?.titleAr || t('specialOffersBannerTitle') : banner?.titleEn || t('specialOffersBannerTitle')}
            </h3>
            <p className="text-white/90 font-medium text-lg drop-shadow-md max-w-md">
              {t('specialOffersBannerDesc')}
            </p>
          </div>
        </div>
        
        {/* Products (7 columns on large screens) -> Grid of 3 columns */}
        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayProducts.map((product) => {
            const name = isAr ? product.nameAr : product.nameEn;
            const price = Number(product.price);
            const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
            
            return (
              <Link 
                key={product.id} 
                href={`/${locale}/products/${product.slug}`}
                className="group flex flex-col bg-white rounded-xl p-3 hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
                  <Image 
                    src={product.images?.[0]?.url || '/placeholder.png'} 
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 p-2"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                    {t('specialOffersBadge')}
                  </div>
                </div>
                <div className="flex flex-col flex-1 px-1">
                  <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors leading-snug">
                    {name}
                  </h4>
                  <div className="mt-auto flex items-center gap-2 pt-1">
                    <span className="font-bold text-black text-sm">{formatPrice(convertPrice(price, exchangeRate), currency, locale)}</span>
                    {compareAtPrice && Number(compareAtPrice) > Number(price) ? (
                      <span className="text-xs text-gray-400 line-through">{formatPrice(convertPrice(compareAtPrice, exchangeRate), currency, locale)}</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
