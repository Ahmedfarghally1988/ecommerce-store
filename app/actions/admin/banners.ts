"use server";

import prisma from '@/lib/prisma';
import { bannerSchema, BannerInput } from '@/lib/validations/admin';
import { checkActionPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';

export async function getBanners() {
  await checkActionPermission('banners.view');
  
  const banners = await prisma.banner.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  
  return banners;
}

export async function getBannerById(id: string) {
  await checkActionPermission('banners.view');
  
  const banner = await prisma.banner.findUnique({
    where: { id },
  });
  
  return banner;
}

export async function createBanner(data: BannerInput) {
  await checkActionPermission('banners.edit');
  const parsed = bannerSchema.parse(data);

  const banner = await prisma.banner.create({
    data: parsed,
  });

  revalidatePath('/admin/banners');
  return banner;
}

export async function updateBanner(id: string, data: BannerInput) {
  await checkActionPermission('banners.edit');
  const parsed = bannerSchema.parse(data);

  const banner = await prisma.banner.update({
    where: { id },
    data: parsed,
  });

  revalidatePath('/admin/banners');
  revalidatePath(`/admin/banners/${id}/edit`);
  return banner;
}

export async function deleteBanner(id: string) {
  await checkActionPermission('banners.edit');
  
  await prisma.banner.delete({
    where: { id },
  });

  revalidatePath('/admin/banners');
  return true;
}

export async function toggleBannerStatus(id: string, isActive: boolean) {
  await checkActionPermission('banners.edit');
  
  const banner = await prisma.banner.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath('/admin/banners');
  return banner;
}
