import prisma from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/permissions';



export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission('products.edit');
  const { id } = await params;
  
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ 
      where: { id }, 
      include: { 
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true
      } 
    }),
    prisma.category.findMany({ orderBy: { nameEn: 'asc' } }),
    prisma.brand.findMany({ orderBy: { nameEn: 'asc' } }),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={JSON.parse(JSON.stringify(product))} categories={categories} brands={brands} />;
}
