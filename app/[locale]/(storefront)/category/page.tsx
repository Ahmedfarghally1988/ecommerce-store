import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories } from '@/app/actions/storefront/categories';
import { ChevronLeft, ChevronRight, Layers, ArrowLeft, ArrowRight, Folder } from 'lucide-react';
import Breadcrumb from '@/components/storefront/Breadcrumb';
import CategoriesGridClient from '@/components/storefront/CategoriesGridClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return {
    title: isAr ? 'جميع الأقسام - المتجر' : 'All Categories - Store',
    description: isAr ? 'تصفح جميع أقسام وتصنيفات المتجر' : 'Browse all categories in our store',
  };
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const allCategories = await getAllCategories();
  const categories = allCategories.filter((c: any) => !c.parentId);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: isAr ? 'جميع الأقسام' : 'All Categories' }]} locale={locale} />


      {/* Header */}
      <div className="mb-10 text-center sm:text-start flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            {isAr ? 'جميع الأقسام' : 'All Categories'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl">
            {isAr 
              ? 'تصفح تشكيلتنا الشاملة عبر جميع الفئات والتصنيفات المتاحة في المتجر' 
              : 'Browse our comprehensive collection across all available categories in the store'}
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold self-center sm:self-auto">
          <Layers className="w-3.5 h-3.5" />
          <span>{categories.length} {isAr ? 'قسم متاح' : 'Categories available'}</span>
        </div>
      </div>

      <CategoriesGridClient categories={categories} locale={locale} />
    </div>
  );
}
