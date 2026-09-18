import React from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getStoreSettings } from '@/lib/settings';
import { getFeaturedProducts, getLatestProducts, getSpecialOfferProducts } from '@/app/actions/storefront/products';
import { getFeaturedCategories } from '@/app/actions/storefront/categories';
import { getHeroSlides } from '@/app/actions/storefront/sliders';
import ProductGrid from '@/components/storefront/ProductGrid';
import ProductCard from '@/components/storefront/ProductCard';
import HeroSlider from '@/components/storefront/HeroSlider';
import BannersSection from '@/components/storefront/BannersSection';
import CTASection from '@/components/storefront/CTASection';
import SpecialOffersSection from '@/components/storefront/SpecialOffersSection';
import NewsletterSection from '@/components/storefront/NewsletterSection';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getActiveBanners, getSpecialOfferBanner } from '@/app/actions/storefront/banners';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Index' });
  const settings = await getStoreSettings();
  
  const customTitle = locale === 'ar' ? settings.index_title_ar : settings.index_title_en;
  const customDesc = locale === 'ar' ? settings.index_description_ar : settings.index_description_en;

  return {
    title: customTitle || t('title'),
    description: customDesc || t('description'),
  };
}

export default async function StorefrontHomepage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Storefront' });
  
  const [heroSlides, featuredProducts, latestProducts, featuredCategories, activeBanners, specialOfferProducts, specialOfferBanner] = await Promise.all([
    getHeroSlides(),
    getFeaturedProducts(),
    getLatestProducts(),
    getFeaturedCategories(),
    getActiveBanners(),
    getSpecialOfferProducts(),
    getSpecialOfferBanner()
  ]);

  return (
    <main className="w-full">
      {/*Swiper Hero Slider */}
      <div className="container mx-auto px-4">
        <HeroSlider slides={heroSlides} locale={locale} />
      </div>

      {/* Featured Categories */}
      {featuredCategories.length > 0 && (
        <div className="container mx-auto px-4">
          <section className="md:py-10 md:px-8 md:bg-gray-50 md:rounded-md my-6 md:my-8">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl font-bold">{t('featuredCategories')}</h2>
            <Link 
              href={`/${locale}/category`} 
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-full transition-colors"
            >
              {t('viewAll')}
              {locale === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {featuredCategories.map((category: any) => {
              const categoryName = locale === 'ar' ? (category.nameAr || category.nameEn) : (category.nameEn || category.nameAr);
              return (
                <Link 
                  key={category.id} 
                  href={`/${locale}/category/${category.slug}`}
                  className="group flex flex-col items-center text-center space-y-2"
                >
                  <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-100 border border-gray-200 group-hover:border-gray-500 transition-colors">
                    {category.image && (
                      <Image src={category.image} alt={categoryName} fill className="object-cover" />
                    )}
                  </div>
                  <span className="font-medium text-gray-800 group-hover:text-black">{categoryName}</span>
                </Link>
              );
            })}
            
            {/* Extra block for mobile to fill the empty space */}
            <Link 
              href={`/${locale}/category`} 
              className="flex md:hidden flex-col items-center text-center space-y-2 group"
            >
              <div className="w-full aspect-square rounded-md overflow-hidden bg-orange-500 text-white flex items-center justify-center border border-orange-400 shadow-sm group-hover:bg-orange-600 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <span className="font-bold text-lg mb-2">{locale === 'ar' ? 'تسوق الآن' : 'Shop Now'}</span>
                  {locale === 'ar' ? <ArrowLeft className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                </div>
              </div>
              {/* Invisible spacer to match height of other category text */}
              <span className="font-medium text-transparent select-none" aria-hidden="true">_</span>
            </Link>
          </div>
        </section>
        </div>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-6 container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">{t('featuredProducts') || 'Featured Products'}</h2>
            <p className="text-gray-500 mt-2">{t('featuredProductsDesc')}</p>
          </div>
          <ProductGrid>
            {featuredProducts.slice(0, 6).map((product: any, index: number) => (
              <div key={product.id} className={`h-full ${index === 5 ? 'block lg:hidden' : 'block'}`}>
                <ProductCard product={product} locale={locale} />
              </div>
            ))}
          </ProductGrid>
        </section>
      )}

      {/* Promotional Banners */}
      <div className="container mx-auto px-4">
        <BannersSection banners={activeBanners} locale={locale} />
      </div>


      {/* Latest Products */}
      {latestProducts.length > 0 && (
        <section className="py-6 container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">{t('latestProducts')}</h2>
            <p className="text-gray-500 mt-2">{t('latestProductsDesc')}</p>
          </div>
          <ProductGrid>
            {latestProducts.slice(0, 6).map((product: any, index: number) => (
              <div key={product.id} className={`h-full ${index === 5 ? 'block lg:hidden' : 'block'}`}>
                <ProductCard product={product} locale={locale} />
              </div>
            ))}
          </ProductGrid>
        </section>
      )}

      {/* Full Width CTA Section */}
      <CTASection locale={locale} />

      {/* Special Offers Section */}
      <SpecialOffersSection products={specialOfferProducts} banner={specialOfferBanner} locale={locale} />

      {/* Newsletter Section (Homepage Only) */}
      <div className="container mx-auto px-4">
        <NewsletterSection locale={locale} />
      </div>
    </main>
  );
}
