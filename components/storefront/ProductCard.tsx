import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCardActions from './ProductCardActions';

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
  shortDescription?: string | null;
};

interface ProductCardProps {
  product: Product;
  locale: string;
  variant?: 'default' | 'small';
}

import { getCustomerCurrency } from '@/lib/currency';
import { convertPrice } from '@/lib/currency-utils';
import { formatPrice } from '@/lib/format';

export default async function ProductCard({ product, locale, variant = 'default' }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url || '/placeholder.png';
  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
  const currencyObj = await getCustomerCurrency();
  const currency = currencyObj?.code || 'EGP';
  const exchangeRate = Number(currencyObj?.exchangeRate || 1);

  const convertedPrice = convertPrice(product.price, exchangeRate);
  const convertedCompareAtPrice = product.compareAtPrice && Number(product.compareAtPrice) > 0 ? convertPrice(product.compareAtPrice, exchangeRate) : null;

  return (
    <div className="group flex flex-col bg-white rounded-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/${locale}/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={product.images?.[0]?.alt || (locale === 'ar' ? product.nameAr : product.nameEn)}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        
        {hasDiscount && (
          <div className="absolute top-3 left-3 pointer-events-none bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full rtl:right-3 rtl:left-auto z-10">
            Sale
          </div>
        )}

        <ProductCardActions product={product} locale={locale} currency={currency} exchangeRate={exchangeRate} />
      </div>
      
      <div className={variant === 'small' ? "p-3 flex flex-col flex-1" : "p-4 flex flex-col flex-1"}>
        <div className="text-xs text-gray-500 mb-1">{locale === 'ar' ? product.category?.nameAr : product.category?.nameEn}</div>
        <Link href={`/${locale}/products/${product.slug}`} className={`font-semibold text-gray-900 line-clamp-2 hover:text-black mb-2 ${variant === 'small' ? 'text-sm min-h-[2.5rem]' : 'min-h-[3rem]'}`}>
          {locale === 'ar' ? product.nameAr : product.nameEn}
        </Link>
        <div className="flex items-baseline gap-2 mt-2">
          <span className={`font-bold text-black ${variant === 'small' ? 'text-base' : 'text-lg'}`}>{formatPrice(convertedPrice, currency, locale)}</span>
          {convertedCompareAtPrice && convertedCompareAtPrice > 0 ? (
            <span className={`text-gray-400 line-through ${variant === 'small' ? 'text-xs' : 'text-sm'}`}>{formatPrice(convertedCompareAtPrice, currency, locale)}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
