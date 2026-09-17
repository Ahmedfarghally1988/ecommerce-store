"use server";

import prisma from "@/lib/prisma";

import { unstable_cache } from "next/cache";

export const getFeaturedCategories = unstable_cache(async () => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      take: 7,
      orderBy: { sortOrder: "asc" }
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch featured categories:", error);
    return [];
  }
}, ['storefront-featured-categories'], { revalidate: 60, tags: ['categories'] });

export const getCategoryBySlug = unstable_cache(async (slug: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug, isActive: true },
      include: {
        children: {
          where: { isActive: true },
          include: {
            _count: { select: { products: { where: { isActive: true } } } }
          }
        },
        parent: true
      }
    });
    return category;
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return null;
  }
}, ['storefront-category-by-slug'], { revalidate: 60, tags: ['categories'] });

export const getAllCategories = unstable_cache(async () => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } }
        },
        children: {
          where: { isActive: true }
        }
      },
      orderBy: { sortOrder: "asc" }
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch all categories:", error);
    return [];
  }
}, ['storefront-all-categories'], { revalidate: 60, tags: ['categories'] });

