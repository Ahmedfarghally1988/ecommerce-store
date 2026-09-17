import prisma from '@/lib/prisma';
import { CategoriesClient } from './CategoriesClient';
import { requireAdminPermission } from '@/lib/permissions';



export default async function CategoriesPage() {
  await requireAdminPermission('categories.view');
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      parent: true,
    },
  });

  return <CategoriesClient categories={categories} />;
}
