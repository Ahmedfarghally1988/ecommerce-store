import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getProducts } from '@/app/actions/storefront/products';
import ProductGrid from '@/components/storefront/ProductGrid';
import ProductCard from '@/components/storefront/ProductCard';
import Link from 'next/link';

export async function generateMetadata({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ q?: string }> }) {
  const { locale } = await params;
  const { q } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'Storefront' });
  return {
    title: q ? `${t('products')} - ${q}` : t('products'),
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { q, page } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'Storefront' });

  const currentPage = Number(page) || 1;
  const { products, totalPages } = await getProducts({ query: q, page: currentPage, limit: 12 });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{q ? `Search: ${q}` : t('products')}</h1>
          {q && <p className="text-gray-500">Showing results for "{q}"</p>}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">{t('noProductsFound')}</p>
          <Link href={`/${locale}/products`} className="mt-4 inline-block text-black font-semibold hover:underline">
            {t('clearFilters')}
          </Link>
        </div>
      ) : (
        <>
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
                  href={`/${locale}/products?${q ? `q=${q}&` : ''}page=${i + 1}`}
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
        </>
      )}
    </div>
  );
}
