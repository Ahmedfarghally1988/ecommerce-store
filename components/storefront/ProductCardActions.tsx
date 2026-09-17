"use client";

import React, { useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Modal } from '@/components/shared/ui/Modal';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';

interface ProductCardActionsProps {
  product: any;
  locale: string;
  currency: string;
  exchangeRate: number;
}

import { convertPrice } from '@/lib/currency-utils';

export default function ProductCardActions({ product, locale, currency, exchangeRate }: ProductCardActionsProps) {
  const { addItem } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const convertedPrice = convertPrice(product.price, exchangeRate);
  const convertedCompareAtPrice = product.compareAtPrice && Number(product.compareAtPrice) > 0 ? convertPrice(product.compareAtPrice, exchangeRate) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem({
      productId: product.id,
      name: locale === 'ar' ? product.nameAr : product.nameEn,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      slug: product.slug,
      price: product.price,
      image: product.images?.[0]?.url,
      quantity: 1,
    });
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
        <button 
          onClick={handleQuickView}
          title={locale === 'ar' ? 'معاينة سريعة' : 'Quick View'} 
          className="bg-white text-gray-900 p-2.5 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors flex items-center justify-center"
        >
          <Eye size={18} />
        </button>
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          title={locale === 'ar' ? 'أضف للسلة' : 'Add to Cart'} 
          className="bg-white text-gray-900 p-2.5 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors flex items-center justify-center disabled:opacity-50"
        >
          <ShoppingCart size={18} />
        </button>
      </div>

      <Modal 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)}
        title={locale === 'ar' ? 'نظرة سريعة' : 'Quick View'}
        maxWidth="max-w-5xl"
      >
        <div className="flex flex-col md:flex-row gap-8 mt-4">
          {/* Images Section */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="relative w-full aspect-square bg-gray-50 rounded-md overflow-hidden border border-gray-100">
               <Image
                src={product.images?.[0]?.url || '/placeholder.png'}
                alt={product.images?.[0]?.alt || (locale === 'ar' ? product.nameAr : product.nameEn)}
                fill
                className="object-contain p-4"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.slice(0, 4).map((img: any) => (
                  <div key={img.id} className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="text-sm text-gray-500 mb-2">
              {locale === 'ar' ? product.category?.nameAr : product.category?.nameEn}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {locale === 'ar' ? product.nameAr : product.nameEn}
            </h3>
            
            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl font-bold text-black">
                {formatPrice(convertedPrice, currency, locale)}
              </span>
              {convertedCompareAtPrice && convertedCompareAtPrice > 0 ? (
                <div className="text-sm text-gray-400 line-through">
                  {formatPrice(convertedCompareAtPrice, currency, locale)}
                </div>
              ) : null}
            </div>
            
            <div className="prose prose-sm text-gray-600 mb-8 max-h-48 overflow-y-auto">
              {(locale === 'ar' ? (product.shortDescriptionAr || product.descriptionAr) : (product.shortDescriptionEn || product.descriptionEn)) ? (
                <div dangerouslySetInnerHTML={{ __html: (locale === 'ar' ? (product.shortDescriptionAr || product.descriptionAr) : (product.shortDescriptionEn || product.descriptionEn)) }} />
              ) : (
                <p>{locale === 'ar' ? 'لا يوجد وصف متاح لهذا المنتج.' : 'No description available for this product.'}</p>
              )}
            </div>
            
            <div className="mt-auto pt-6 border-t flex gap-4">
              <button
                onClick={(e) => {
                  handleAddToCart(e);
                  setIsQuickViewOpen(false);
                }}
                disabled={isAdding}
                className="flex-1 bg-black text-white py-4 px-6 rounded-md font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart size={20} />
                {locale === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
              </button>
              <Link 
                href={`/${locale}/products/${product.slug}`}
                className="flex-1 border-2 border-gray-200 text-center py-4 px-6 rounded-md font-bold hover:border-gray-500 transition-all text-black flex items-center justify-center"
              >
                {locale === 'ar' ? 'عرض التفاصيل الكاملة' : 'View Full Details'}
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
