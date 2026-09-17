import prisma from '@/lib/prisma';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/permissions';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission('categories.edit');
  const { id } = await params;

  const [category, categories] = await Promise.all([
    prisma.category.findUnique({
      where: { id },
    }),
    prisma.category.findMany({
      orderBy: { nameEn: 'asc' },
    }),
  ]);

  if (!category) {
    notFound();
  }

  return <CategoryForm initialData={category} categories={categories} />;
}
