"use server";

import prisma from '@/lib/prisma';
import { heroSlideSchema, HeroSlideInput } from '@/lib/validations/admin-slide';
import { checkActionPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';





export async function createHeroSlide(data: HeroSlideInput) {
  await checkActionPermission('sliders.create');
  const parsed = heroSlideSchema.parse(data);

  const slide = await prisma.heroSlide.create({
    data: {
      titleEn: parsed.titleEn || '',
      titleAr: parsed.titleAr || '',
      descriptionEn: parsed.descriptionEn || null,
      descriptionAr: parsed.descriptionAr || null,
      image: parsed.image,
      mobileImage: parsed.mobileImage || null,
      buttonTextEn: parsed.buttonTextEn || null,
      buttonTextAr: parsed.buttonTextAr || null,
      buttonUrl: parsed.buttonUrl || null,
      isActive: parsed.isActive,
      sortOrder: parsed.sortOrder,
    },
  });

  revalidatePath('/admin/sliders');
  revalidatePath('/[locale]', 'layout');
  return slide;
}

export async function updateHeroSlide(id: string, data: HeroSlideInput) {
  await checkActionPermission('sliders.edit');
  const parsed = heroSlideSchema.parse(data);

  const slide = await prisma.heroSlide.update({
    where: { id },
    data: {
      titleEn: parsed.titleEn || '',
      titleAr: parsed.titleAr || '',
      descriptionEn: parsed.descriptionEn || null,
      descriptionAr: parsed.descriptionAr || null,
      image: parsed.image,
      mobileImage: parsed.mobileImage || null,
      buttonTextEn: parsed.buttonTextEn || null,
      buttonTextAr: parsed.buttonTextAr || null,
      buttonUrl: parsed.buttonUrl || null,
      isActive: parsed.isActive,
      sortOrder: parsed.sortOrder,
    },
  });

  revalidatePath('/admin/sliders');
  revalidatePath('/[locale]', 'layout');
  return slide;
}

export async function deleteHeroSlide(id: string) {
  await checkActionPermission('sliders.delete');

  await prisma.heroSlide.delete({
    where: { id },
  });

  revalidatePath('/admin/sliders');
  revalidatePath('/[locale]', 'layout');
  return true;
}

export async function toggleHeroSlideStatus(id: string, isActive: boolean) {
  await checkActionPermission('sliders.edit');

  const slide = await prisma.heroSlide.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath('/admin/sliders');
  revalidatePath('/[locale]', 'layout');
  return slide;
}

export async function reorderHeroSlides(orderedIds: string[]) {
  await checkActionPermission('sliders.edit');

  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.heroSlide.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );

  revalidatePath('/admin/sliders');
  revalidatePath('/[locale]', 'layout');
  return true;
}
