"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";


import { unstable_cache } from "next/cache";

export const getFeaturedProducts = unstable_cache(async () => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 10,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1
        },
        category: true,
      },
      orderBy: { createdAt: "desc" }
    });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}, ['storefront-featured-products'], { revalidate: 60, tags: ['products'] });

export const getLatestProducts = unstable_cache(async () => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isLatest: true },
      take: 10,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1
        },
        category: true,
      },
      orderBy: { createdAt: "desc" }
    });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Failed to fetch latest products:", error);
    return [];
  }
}, ['storefront-latest-products'], { revalidate: 60, tags: ['products'] });

export const getSpecialOfferProducts = unstable_cache(async () => {
  try {
    // Fetch products that are marked as special offer
    const products = await prisma.product.findMany({
      where: { 
        isActive: true,
        isSpecialOffer: true
      },
      take: 6,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1
        },
        category: true,
      },
      orderBy: { createdAt: "desc" }
    });
    
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Failed to fetch special offer products:", error);
    return [];
  }
}, ['storefront-special-offer-products'], { revalidate: 60, tags: ['products'] });

export const getProductBySlug = unstable_cache(async (slug: string) => {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const product = await prisma.product.findUnique({
      where: { slug: decodedSlug },
      include: {
        images: {
          orderBy: { sortOrder: "asc" }
        },
        category: true,
        brand: true,
        variants: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });
    if (!product || !product.isActive) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}, ['storefront-product-by-slug'], { revalidate: 60, tags: ['products'] });

export const getProducts = unstable_cache(async (options?: { 
  categoryId?: string; 
  query?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const { categoryId, query, page = 1, limit = 12 } = options || {};
    
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (query) {
      where.OR = [
        { nameEn: { contains: query } },
        { nameAr: { contains: query } },
        { shortDescriptionEn: { contains: query } },
        { shortDescriptionAr: { contains: query } },
        { descriptionEn: { contains: query } },
        { descriptionAr: { contains: query } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1
          },
          category: true,
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.product.count({ where })
    ]);

    return {
      products: JSON.parse(JSON.stringify(products)),
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { products: [], total: 0, totalPages: 0 };
  }
}, ['storefront-all-products'], { revalidate: 60, tags: ['products'] });

export const getRelatedProducts = unstable_cache(async (productId: string, categoryId: string, limit: number = 5) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: categoryId,
        id: { not: productId }
      },
      take: limit,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1
        },
        category: true,
      },
      orderBy: { createdAt: "desc" } // or could use rand
    });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}, ['storefront-related-products'], { revalidate: 60, tags: ['products'] });
