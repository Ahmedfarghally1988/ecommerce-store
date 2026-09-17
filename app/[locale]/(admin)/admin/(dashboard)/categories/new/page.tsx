import prisma from '@/lib/prisma';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { requireAdminPermission } from '@/lib/permissions';

export default async function NewCategoryPage() {
  await requireAdminPermission('categories.create');
  
  const categories = await prisma.category.findMany({
    orderBy: { nameEn: 'asc' },
  });

  return <CategoryForm categories={categories} />;
}
