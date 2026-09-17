"use server";

import prisma from '@/lib/prisma';
import { categorySchema, CategoryInput } from '@/lib/validations/admin';
import { checkActionPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';





export async function createCategory(data: CategoryInput) {
  await checkActionPermission('categories.create');
  const parsed = categorySchema.parse(data);

  const category = await prisma.category.create({
    data: {
      nameEn: parsed.nameEn,
      nameAr: parsed.nameAr,
      slug: parsed.slug,
      descriptionEn: parsed.descriptionEn,
      descriptionAr: parsed.descriptionAr,
      isActive: parsed.isActive,
      showInHeader: parsed.showInHeader,
      showInFooter: parsed.showInFooter,
      sortOrder: parsed.sortOrder,
      parentId: parsed.parentId || null,
      image: parsed.image,
      metaTitle: parsed.metaTitle || null,
      metaDescription: parsed.metaDescription || null,
      canonicalUrl: parsed.canonicalUrl || null,
      customSchema: parsed.customSchema || null,
    } as any,
  });

  revalidatePath('/admin/categories');
  revalidatePath('/', 'layout');
  return category;
}

export async function updateCategory(id: string, data: CategoryInput) {
  await checkActionPermission('categories.edit');
  const parsed = categorySchema.parse(data);

  const category = await prisma.category.update({
    where: { id },
    data: {
      nameEn: parsed.nameEn,
      nameAr: parsed.nameAr,
      slug: parsed.slug,
      descriptionEn: parsed.descriptionEn,
      descriptionAr: parsed.descriptionAr,
      isActive: parsed.isActive,
      showInHeader: parsed.showInHeader,
      showInFooter: parsed.showInFooter,
      sortOrder: parsed.sortOrder,
      parentId: parsed.parentId || null,
      image: parsed.image,
      metaTitle: parsed.metaTitle || null,
      metaDescription: parsed.metaDescription || null,
      canonicalUrl: parsed.canonicalUrl || null,
      customSchema: parsed.customSchema || null,
    } as any,
  });

  revalidatePath('/admin/categories');
  revalidatePath('/', 'layout');
  return category;
}

export async function toggleCategoryStatus(
  id: string,
  field: 'isActive' | 'showInHeader' | 'showInFooter',
  value: boolean
) {
  await checkActionPermission('categories.edit');

  const category = await prisma.category.update({
    where: { id },
    data: {
      [field]: value,
    } as any,
  });

  revalidatePath('/admin/categories');
  revalidatePath('/', 'layout');
  return category;
}

export async function deleteCategory(id: string) {
  await checkActionPermission('categories.delete');
  
  await prisma.category.delete({
    where: { id },
  });

  revalidatePath('/admin/categories');
  revalidatePath('/', 'layout');
  return true;
}

