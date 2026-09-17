import React from 'react';
import { getProductBySlug, getRelatedProducts } from '@/app/actions/storefront/products';
import { getApprovedReviews } from '@/app/actions/storefront/reviews';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/storefront/ProductGallery';
import AddToCartForm from '@/components/storefront/AddToCartForm';
import Breadcrumb from '@/components/storefront/Breadcrumb';
import ProductCard from '@/components/storefront/ProductCard';
import ProductReviews from '@/components/storefront/ProductReviews';
import { getCustomerSession } from '@/lib/auth';

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug);
  const isAr = locale === 'ar';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    title: product ? ((isAr ? product.metaTitle || product.nameAr : product.metaTitle || product.nameEn) || 'Product') : 'Product',
    description: product ? ((isAr ? product.metaDescription || product.shortDescriptionAr : product.metaDescription || product.shortDescriptionEn) || '') : '',
    alternates: {
      canonical: (product as any)?.canonicalUrl ? (product as any).canonicalUrl : `${baseUrl}/${locale}/products/${slug}`,
    }
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug);
  const isAr = locale === 'ar';

  if (!product) {
    notFound();
  }

  const [reviews, session] = await Promise.all([
    getApprovedReviews(product.id),
    getCustomerSession()
  ]);

  let relatedProducts = [];
  if (product.showRelatedProducts && product.categoryId) {
    relatedProducts = await getRelatedProducts(product.id, product.categoryId, 6);
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const currentUrl = (product as any)?.canonicalUrl ? (product as any).canonicalUrl : `${baseUrl}/${locale}/products/${product.slug}`;

  const jsonLd = (product as any)?.customSchema 
    ? (product as any).customSchema 
    : JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: isAr ? product.nameAr : product.nameEn,
        description: (isAr ? product.shortDescriptionAr : product.shortDescriptionEn) || '',
        image: product.images?.[0]?.url ? [product.images[0].url] : [],
        sku: product.sku,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD', // You may want to fetch store currency here
          price: Number(product.price).toString(),
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: currentUrl,
        }
      });

  return (
    <div className="container mx-auto px-4 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Breadcrumb 
        items={[
          { label: isAr ? 'الأقسام' : 'Categories', href: `/${locale}/category` },
          ...(product.category ? [{ label: (isAr ? product.category.nameAr : product.category.nameEn) || '', href: `/${locale}/category/${product.category.slug}` }] : []),
          { label: isAr ? product.nameAr : product.nameEn }
        ]} 
        locale={locale} 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Gallery */}
        <div>
          <ProductGallery images={product.images || []} />
        </div>

        {/* Details & Actions */}
        <div className="flex flex-col">
          <div className="mb-2 text-sm text-gray-500 font-medium">
            {isAr ? product.category?.nameAr : product.category?.nameEn}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{isAr ? product.nameAr : product.nameEn}</h1>
          
          {(isAr ? product.shortDescriptionAr : product.shortDescriptionEn) && (
            <p className="text-gray-600 mb-8 text-lg">{isAr ? product.shortDescriptionAr : product.shortDescriptionEn}</p>
          )}

          <div className="mb-8">
            <AddToCartForm 
              product={product} 
              variants={product.variants || []} 
            />
          </div>
        </div>
      </div>

      {/* Full Width Description Block */}
      <div className="mt-16 bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-4">
          {isAr ? 'تفاصيل المنتج' : 'Product Details'}
        </h2>
        <div className="prose prose-lg max-w-none text-gray-700">
          {(isAr ? product.descriptionAr : product.descriptionEn) ? (
            <div 
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: isAr ? product.descriptionAr : product.descriptionEn }} 
            />
          ) : (
            <p className="text-gray-500 italic">
              {isAr ? 'لا توجد تفاصيل إضافية متاحة لهذا المنتج حالياً.' : 'No additional details are available for this product at this time.'}
            </p>
          )}
        </div>
      </div>
      
      {/* Related Products Block */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {isAr ? 'منتجات ذات صلة' : 'Related Products'}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedProducts.map((relatedProduct: any) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} locale={locale} variant="small" />
            ))}
          </div>
        </div>
      )}

      {/* Reviews Block */}
      <ProductReviews 
        productId={product.id} 
        locale={locale} 
        reviews={reviews} 
        isLoggedIn={!!session?.userId} 
        currentUser={session ? { name: session.name || '', email: session.email || '' } : null}
      />
    </div>
  );
}
