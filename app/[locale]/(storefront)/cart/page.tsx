"use client";

import React, { use } from 'react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';
import { convertPrice } from '@/lib/currency-utils';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import QuantityControl from '@/components/storefront/QuantityControl';
import { Trash2 } from 'lucide-react';
import Breadcrumb from '@/components/storefront/Breadcrumb';

export default function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('Storefront');
  const { items, updateQuantity, removeItem, subtotal, isMounted, currency, exchangeRate, locale: cartLocale } = useCart();

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <Breadcrumb items={[{ label: t('cart') }]} locale={locale} />
        </div>
        <h1 className="text-3xl font-bold mb-4">{t('cart')}</h1>
        <div className="bg-gray-50 rounded-2xl py-12 px-4 mb-8">
          <p className="text-gray-500 text-lg mb-6">{t('emptyCart')}</p>
          <Link 
            href={`/${locale}/products`}
            className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: t('cart') }]} locale={locale} />
      <h1 className="text-3xl font-bold mb-8 mt-6">{t('cart')}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-sm font-semibold text-gray-600 uppercase">
              <div className="col-span-6">{t('products')}</div>
              <div className="col-span-3 text-center">{t('quantity')}</div>
              <div className="col-span-2 text-right">{t('total')}</div>
              <div className="col-span-1"></div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 sm:col-span-6 flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <Link href={`/${locale}/products/${item.slug}`} className="font-semibold hover:underline line-clamp-2">
                        {item.name}
                      </Link>
                      {item.variantName && (
                        <span className="text-sm text-gray-500 mt-1">{item.variantName}</span>
                      )}
                      <span className="font-medium mt-1 sm:hidden">{formatPrice(convertPrice(item.price, exchangeRate), currency, cartLocale)}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 sm:col-span-3 flex justify-start sm:justify-center">
                    <QuantityControl 
                      quantity={item.quantity}
                      onIncrease={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      onDecrease={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      onRemove={() => removeItem(item.productId, item.variantId)}
                    />
                  </div>
                  
                  <div className="col-span-1 sm:col-span-2 text-right font-semibold">
                    {formatPrice(convertPrice(Number(item.price) * item.quantity, exchangeRate), currency, cartLocale)}
                  </div>
                  
                  <div className="col-span-1 flex justify-end">
                    <button 
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('remove')}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="flex justify-between mb-4 text-gray-600">
              <span>{t('subtotal')}</span>
              <span className="font-semibold text-black">{formatPrice(convertPrice(subtotal, exchangeRate), currency, cartLocale)}</span>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between">
              <span className="font-bold text-lg">{t('total')}</span>
              <span className="font-bold text-lg">{formatPrice(convertPrice(subtotal, exchangeRate), currency, cartLocale)}</span>
            </div>
            
            <Link href={`/${locale}/checkout`} className="w-full flex items-center justify-center bg-black text-white font-bold py-4 rounded-xl mt-8 hover:bg-gray-800 transition-colors">
              {t('checkout')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
