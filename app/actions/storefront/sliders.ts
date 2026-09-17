"use server";

import prisma from "@/lib/prisma";

import { unstable_cache } from "next/cache";

export const getHeroSlides = unstable_cache(async () => {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return JSON.parse(JSON.stringify(slides));
  } catch (error) {
    console.error("Failed to fetch hero slides:", error);
    return [];
  }
}, ['storefront-hero-slides'], { revalidate: 60, tags: ['sliders'] });
