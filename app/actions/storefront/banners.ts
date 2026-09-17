"use server";

import prisma from "@/lib/prisma";

import { unstable_cache } from "next/cache";

export const getActiveBanners = unstable_cache(async () => {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true, position: 'GRID' },
      orderBy: { sortOrder: 'asc' },
      take: 3, // Display up to 3 banners
    });
    return banners;
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return [];
  }
}, ['storefront-active-banners'], { revalidate: 60, tags: ['banners'] });

export const getSpecialOfferBanner = unstable_cache(async () => {
  try {
    const banner = await prisma.banner.findFirst({
      where: { isActive: true, position: 'SPECIAL_OFFER' },
      orderBy: { sortOrder: 'asc' },
    });
    return banner;
  } catch (error) {
    console.error("Failed to fetch special offer banner:", error);
    return null;
  }
}, ['storefront-special-offer-banner'], { revalidate: 60, tags: ['banners'] });
