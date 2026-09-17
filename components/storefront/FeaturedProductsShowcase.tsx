import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCustomerCurrency } from '@/lib/currency';
import { convertPrice } from '@/lib/currency-utils';
import { formatPrice } from '@/lib/format';
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';

type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
};

type Product = {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: ProductImage[];
  category?: { nameEn: string, nameAr: string } | null;
};

interface FeaturedShowcaseProps {
  products: Product[];
  locale: string;
  title: string;
}

export default async function FeaturedProductsShowcase({ products, locale, title }: FeaturedShowcaseProps) {
  if (!products || products.length === 0) return null;
  
  const currencyObj = await getCustomerCurrency();
  const currency = currencyObj?.code || 'EGP';
  const exchangeRate = Number(currencyObj?.exchangeRate || 1);
  const isRtl = locale === 'ar';
  
  const mainProduct = products[0];
  const sideProductsRight = products.slice(1, 3); // For RTL, this will be physically on the right
  const sideProductsLeft = products.slice(3, 5); // For RTL, this will be physically on the left
  
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-10">{title}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Right Column (in RTL, it renders visually on the right) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {sideProductsRight.map((product) => (
              <SideProductCard key={product.id} product={product} locale={locale} currency={currency} exchangeRate={exchangeRate} isRtl={isRtl} />
            ))}
          </div>

          {/* Center Column - Main Banner */}
          <div className="lg:col-span-6 h-[400px] lg:h-auto min-h-[400px]">
            <div className="group relative w-full h-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex items-center justify-center">
              {/* Background Image */}
              <Image
                src={mainProduct.images?.[0]?.url || '/placeholder.png'}
                alt={mainProduct.images?.[0]?.alt || (isRtl ? mainProduct.nameAr : mainProduct.nameEn)}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center text-white">
                <div className="text-sm font-bold tracking-widest text-white/80 uppercase mb-3 drop-shadow-md">
                  {isRtl ? mainProduct.category?.nameAr : mainProduct.category?.nameEn}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold leading-tight mb-4 drop-shadow-lg">
                  {isRtl ? mainProduct.nameAr : mainProduct.nameEn}
                </h3>
                
                <div className="flex items-center gap-3 mb-8 drop-shadow-md">
                    <span className="text-2xl font-black text-white drop-shadow-sm">
                    {formatPrice(convertPrice(mainProduct.price, exchangeRate), currency, locale)}
                    </span>
                    {mainProduct.compareAtPrice && Number(mainProduct.compareAtPrice) > Number(mainProduct.price) ? (
                      <span className="text-xl text-white/70 line-through">
                      {formatPrice(convertPrice(mainProduct.compareAtPrice, exchangeRate), currency, locale)}
                      </span>
                    ) : null}
                  </div>
                
                <Link 
                  href={`/${locale}/products/${mainProduct.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-black hover:bg-gray-100 rounded-full font-bold transition-transform hover:-translate-y-1 shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isRtl ? 'تسوق الآن' : 'Shop Now'}
                </Link>
              </div>

              {/* Sale Badge */}
              {mainProduct.compareAtPrice && Number(mainProduct.compareAtPrice) > Number(mainProduct.price) ? (
                <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full z-20 shadow-lg">
                  {isRtl ? 'تخفيض' : 'Sale'}
                </div>
              ) : null}
            </div>
          </div>

          {/* Left Column (in RTL, it renders visually on the left) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {sideProductsLeft.map((product) => (
              <SideProductCard key={product.id} product={product} locale={locale} currency={currency} exchangeRate={exchangeRate} isRtl={isRtl} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

function SideProductCard({ product, locale, currency, exchangeRate, isRtl }: { product: Product; locale: string; currency: string; exchangeRate: number; isRtl: boolean }) {
  return (
    <Link 
      href={`/${locale}/products/${product.slug}`}
      className="group flex flex-row items-center bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all flex-1"
    >
      <div className="relative w-1/3 min-w-[100px] h-full min-h-[120px] bg-gray-50 flex items-center justify-center p-2">
        <Image
          src={product.images?.[0]?.url || '/placeholder.png'}
          alt={product.images?.[0]?.alt || (isRtl ? product.nameAr : product.nameEn)}
          fill
          className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
        />
        {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) ? (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full rtl:right-2 rtl:left-auto z-10 shadow-sm">
            %
          </div>
        ) : null}
      </div>
      
      <div className="w-2/3 p-4 flex flex-col justify-center">
        <div className="text-xs font-medium text-gray-400 mb-1 line-clamp-1">
          {isRtl ? product.category?.nameAr : product.category?.nameEn}
        </div>
        <h4 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {isRtl ? product.nameAr : product.nameEn}
        </h4>
          <div className="flex items-baseline gap-2 mt-auto pt-2">
            <span className="font-bold text-black text-lg">
            {formatPrice(convertPrice(product.price, exchangeRate), currency, locale)}
            </span>
            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) ? (
              <span className="text-sm text-gray-400 line-through">
              {formatPrice(convertPrice(product.compareAtPrice, exchangeRate), currency, locale)}
              </span>
            ) : null}
          </div>
      </div>
    </Link>
  );
}
