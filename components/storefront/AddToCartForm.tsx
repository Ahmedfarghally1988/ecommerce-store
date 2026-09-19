"use client";

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';
import { convertPrice } from '@/lib/currency-utils';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import QuantityControl from './QuantityControl';

interface Variant {
  id: string;
  name: string;
  nameEn: string;
  nameAr: string;
  price: number;
  stock: number;
  attributes?: Record<string, string> | null | any;
}

interface AddToCartFormProps {
  product: {
    id: string;
    name: string;
    nameEn: string;
    nameAr: string;
    slug: string;
    price: number;
    stock: number;
    images?: { url: string }[];
  };
  variants: Variant[];
}

export default function AddToCartForm({ product, variants }: AddToCartFormProps) {
  const t = useTranslations('Storefront');
  const router = useRouter();
  const { addItem, currency, exchangeRate, locale } = useCart();
  
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants.length > 0 ? '' : 'none'
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const groups: Record<string, Set<string>> = {};
  variants.forEach(v => {
    if (v.attributes && typeof v.attributes === 'object') {
      Object.entries(v.attributes).forEach(([key, val]) => {
        if (!groups[key]) groups[key] = new Set();
        groups[key].add(String(val));
      });
    }
  });

  const parsedGroups = Object.entries(groups).map(([name, valuesSet]) => ({
    name,
    values: Array.from(valuesSet)
  }));

  const handleOptionSelect = (groupName: string, value: string) => {
    const newOptions = { ...selectedOptions, [groupName]: value };
    setSelectedOptions(newOptions);

    const matching = variants.find(v => {
      if (!v.attributes || typeof v.attributes !== 'object') return false;
      const attrs = v.attributes as Record<string, string>;
      return Object.entries(newOptions).every(([k, val]) => attrs[k] === val);
    });

    if (matching) {
      setSelectedVariantId(matching.id);
    } else {
      setSelectedVariantId('');
    }
  };

  const selectedVariant = variants.find(v => v.id === selectedVariantId);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (variants.length > 0 && !selectedVariant) {
      alert(t('selectVariant'));
      return;
    }
    
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      name: product.name,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      slug: product.slug,
      price: Number(currentPrice),
      image: product.images?.[0]?.url,
      quantity,
      variantName: selectedVariant?.name,
      variantNameEn: selectedVariant?.nameEn,
      variantNameAr: selectedVariant?.nameAr
    });
    
    setQuantity(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold">{formatPrice(convertPrice(currentPrice, exchangeRate), currency, locale)}</span>
          {isOutOfStock ? (
            <span className="text-sm font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">{t('outOfStock')}</span>
          ) : currentStock <= 5 ? (
            <span className="text-sm font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full">{t('lowStock')}</span>
          ) : (
            <span className="text-sm font-medium text-green-500 bg-green-50 px-3 py-1 rounded-full">{t('inStock')}</span>
          )}
        </div>
      </div>

      {parsedGroups.length > 0 ? (
        <div className="flex flex-col gap-5">
          {parsedGroups.map(group => (
            <div key={group.name} className="flex flex-col gap-2">
              <label className="text-sm font-medium">{group.name}</label>
              <div className="flex flex-wrap gap-2">
                {group.values.map(val => (
                  <button
                    key={val}
                    onClick={() => handleOptionSelect(group.name, val)}
                    className={`px-4 py-2 text-sm border rounded-lg transition-all ${
                      selectedOptions[group.name] === val 
                        ? 'border-gray-500 bg-black text-white' 
                        : 'border-gray-200 hover:border-gray-500 bg-white'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {/* Missing option warning */}
          {Object.keys(selectedOptions).length > 0 && Object.keys(selectedOptions).length < parsedGroups.length && (
            <p className="text-xs text-orange-600">الرجاء تحديد جميع الخيارات المتاحة.</p>
          )}
        </div>
      ) : variants.length > 0 ? (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t('selectVariant')}</label>
          <div className="flex flex-wrap gap-2">
            {variants.map(variant => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantId(variant.id)}
                disabled={variant.stock <= 0}
                className={`px-4 py-2 text-sm border rounded-lg transition-all ${
                  selectedVariantId === variant.id 
                    ? 'border-gray-500 bg-black text-white' 
                    : 'border-gray-200 hover:border-gray-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 pt-4 mt-2">
        <div className="flex flex-row items-center justify-between bg-gray-50 border border-gray-100 p-2 rounded-lg w-full">
          <label className="text-sm text-gray-700 font-medium px-2">{t('quantity')}</label>
          <QuantityControl 
            quantity={quantity} 
            onIncrease={() => setQuantity(q => Math.min(q + 1, currentStock))}
            onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
            max={currentStock}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || (variants.length > 0 && !selectedVariant)}
          className="flex-1 bg-white text-black border border-black py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('addToCart')}
        </button>
        <button
          onClick={() => {
            handleAddToCart();
            router.push(`/${locale}/checkout`);
          }}
          disabled={isOutOfStock || (variants.length > 0 && !selectedVariant)}
          className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {locale === 'ar' ? 'شراء الآن' : 'Buy Now'}
        </button>
        </div>
      </div>
    </div>
  );
}
