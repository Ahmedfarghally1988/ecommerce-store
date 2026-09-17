"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Folder, Search } from 'lucide-react';

interface CategoriesGridClientProps {
  categories: any[];
  locale: string;
}

export default function CategoriesGridClient({ categories, locale }: CategoriesGridClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const isAr = locale === 'ar';

  const filteredCategories = categories.filter(category => {
    const name = isAr ? (category.nameAr || category.nameEn) : (category.nameEn || category.nameAr);
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      {/* Grid */}
      {filteredCategories.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-3xl border border-gray-100">
          <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">
            {isAr ? 'لم يتم العثور على نتائج' : 'No results found'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isAr ? 'جرب البحث بكلمات مختلفة' : 'Try searching with different keywords'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredCategories.map((category) => {
            const name = isAr ? (category.nameAr || category.nameEn) : (category.nameEn || category.nameAr);
            const productCount = category._count?.products || 0;

            return (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="group flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                {/* Category Image */}
                <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <Folder className="w-12 h-12 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  )}
                </div>

                {/* Category Title & Badge */}
                <div className="p-4 sm:p-5 text-center flex-1 flex flex-col justify-center bg-white border-t border-gray-50">
                  <h2 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {name}
                  </h2>
                  <span className="mt-1.5 text-xs font-medium text-gray-500 bg-gray-50/80 px-2 py-1 rounded-md inline-block mx-auto group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {productCount} {isAr ? 'منتج' : 'products'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
