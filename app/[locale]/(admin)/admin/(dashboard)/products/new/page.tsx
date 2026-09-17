import prisma from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';
import { requireAdminPermission } from '@/lib/permissions';



export default async function NewProductPage() {
  await requireAdminPermission('products.create');
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { nameEn: 'asc' } }),
    prisma.brand.findMany({ orderBy: { nameEn: 'asc' } }),
  ]);

  return <ProductForm categories={categories} brands={brands} />;
}
