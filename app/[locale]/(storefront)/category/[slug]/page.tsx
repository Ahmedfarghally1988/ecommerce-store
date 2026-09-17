import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getCategoryBySlug } from '@/app/actions/storefront/categories';
import { getProducts } from '@/app/actions/storefront/products';
import ProductGrid from '@/components/storefront/ProductGrid';
import ProductCard from '@/components/storefront/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import CategoriesGridClient from '@/components/storefront/CategoriesGridClient';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/storefront/Breadcrumb';
import { Folder } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const category = await getCategoryBySlug(slug);
  const categoryName = category ? (locale === 'ar' ? (category.nameAr || category.nameEn) : (category.nameEn || category.nameAr)) : 'Category';
  const categoryDesc = category ? (locale === 'ar' ? (category.descriptionAr || category.descriptionEn) : (category.descriptionEn || category.descriptionAr)) : '';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: category ? (category.metaTitle || categoryName) : categoryName,
    description: category ? (category.metaDescription || categoryDesc || `Browse products in ${categoryName}`) : `Browse products in ${categoryName}`,
    alternates: {
      canonical: (category as any)?.canonicalUrl ? (category as any).canonicalUrl : `${baseUrl}/${locale}/category/${slug}`,
    }
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale, slug } = await params;
  const { page } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'Storefront' });

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const categoryName = locale === 'ar' ? (category.nameAr || category.nameEn) : (category.nameEn || category.nameAr);
  const categoryDesc = locale === 'ar' ? (category.descriptionAr || category.descriptionEn) : (category.descriptionEn || category.descriptionAr);

  const currentPage = Number(page) || 1;
  const { products, totalPages } = await getProducts({ categoryId: category.id, page: currentPage, limit: 12 });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const currentUrl = (category as any)?.canonicalUrl ? (category as any).canonicalUrl : `${baseUrl}/${locale}/category/${category.slug}`;

  const jsonLd = (category as any)?.customSchema 
    ? (category as any).customSchema 
    : JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: categoryName,
        description: categoryDesc || '',
        url: currentUrl,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: products.map((product: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${baseUrl}/${locale}/products/${product.slug}`,
            name: locale === 'ar' ? product.nameAr : product.nameEn
          }))
        }
      });

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Breadcrumb 
        items={[
          { label: locale === 'ar' ? 'جميع الأقسام' : 'All Categories', href: `/${locale}/category` },
          ...((category as any).parent ? [{ 
            label: locale === 'ar' ? ((category as any).parent.nameAr || (category as any).parent.nameEn) : ((category as any).parent.nameEn || (category as any).parent.nameAr), 
            href: `/${locale}/category/${(category as any).parent.slug}` 
          }] : []),
          { label: categoryName }
        ]} 
        locale={locale} 
      />
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
        {categoryDesc && <p className="text-gray-500">{categoryDesc}</p>}
      </div>

      {/* Subcategories Grid */}
      {(category as any).children && (category as any).children.length > 0 && (
        <div className="mb-12">
          <CategoriesGridClient categories={(category as any).children} locale={locale} />
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        !(category as any).children || (category as any).children.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">{t('noProductsFound')}</p>
          </div>
        ) : null
      ) : (
        <div className="mt-8">
          {((category as any).children && (category as any).children.length > 0) && (
            <h2 className="text-xl font-bold mb-6 text-gray-900">{locale === 'ar' ? 'المنتجات' : 'Products'}</h2>
          )}
          <ProductGrid>
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </ProductGrid>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Link
                  key={i}
                  href={`/${locale}/category/${slug}?page=${i + 1}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
                    currentPage === i + 1 
                      ? 'bg-black text-white border-gray-500' 
                      : 'bg-white text-black hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
