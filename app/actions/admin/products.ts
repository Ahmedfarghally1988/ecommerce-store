"use server";

import prisma from '@/lib/prisma';
import { productSchema, ProductInput } from '@/lib/validations/admin';
import { checkActionPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';





export async function createProduct(data: ProductInput) {
  await checkActionPermission('products.create');
  const parsed = productSchema.parse(data);
  const { images, variants, ...productData } = parsed;

  const product = await prisma.product.create({
    data: {
      ...productData,
      images: {
        create: images.map((url, index) => ({ url, sortOrder: index }))
      },
      variants: variants && variants.length > 0 ? {
        create: variants.map(v => ({
          nameEn: v.nameEn,
          nameAr: v.nameAr,
          sku: v.sku,
          price: v.price,
          stock: v.stock,
          attributes: v.attributes || {}
        }))
      } : undefined
    },
  });

  revalidatePath('/admin/products');
  return product;
}

export async function updateProduct(id: string, data: ProductInput) {
  await checkActionPermission('products.edit');
  const parsed = productSchema.parse(data);
  const { images, variants, ...productData } = parsed;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...productData,
      images: {
        deleteMany: {},
        create: images.map((url, index) => ({ url, sortOrder: index }))
      }
    },
  });

  const variantIds = (variants || []).map(v => v.id).filter(Boolean) as string[];
  
  await prisma.productVariant.deleteMany({
    where: { productId: id, id: { notIn: variantIds } }
  });

  if (variants && variants.length > 0) {
    for (const v of variants) {
      if (v.id) {
        await prisma.productVariant.update({
          where: { id: v.id },
          data: { nameEn: v.nameEn, nameAr: v.nameAr, sku: v.sku, price: v.price, stock: v.stock, attributes: v.attributes || {} }
        });
      } else {
        await prisma.productVariant.create({
          data: { productId: id, nameEn: v.nameEn, nameAr: v.nameAr, sku: v.sku, price: v.price, stock: v.stock, attributes: v.attributes || {} }
        });
      }
    }
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}/edit`);
  return product;
}

export async function deleteProduct(id: string) {
  await checkActionPermission('products.delete');
  
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath('/admin/products');
  return true;
}

export async function toggleProductStatus(id: string, isActive: boolean) {
  await checkActionPermission('products.edit');
  
  await prisma.product.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath('/admin/products');
  return true;
}
