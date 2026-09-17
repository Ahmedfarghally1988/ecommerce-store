"use server";

import prisma from '@/lib/prisma';
import { brandSchema, BrandInput } from '@/lib/validations/admin';
import { checkActionPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';





export async function createBrand(data: BrandInput) {
  await checkActionPermission('brands.create');
  const parsed = brandSchema.parse(data);

  const brand = await prisma.brand.create({
    data: parsed,
  });

  revalidatePath('/admin/brands');
  return brand;
}

export async function updateBrand(id: string, data: BrandInput) {
  await checkActionPermission('brands.edit');
  const parsed = brandSchema.parse(data);

  const brand = await prisma.brand.update({
    where: { id },
    data: {
      nameEn: parsed.nameEn,
      nameAr: parsed.nameAr,
      slug: parsed.slug,
      descriptionEn: parsed.descriptionEn,
      descriptionAr: parsed.descriptionAr,
    },
  });

  revalidatePath('/admin/brands');
  return brand;
}

export async function deleteBrand(id: string) {
  await checkActionPermission('brands.delete');
  
  await prisma.brand.delete({
    where: { id },
  });

  revalidatePath('/admin/brands');
  return true;
}
