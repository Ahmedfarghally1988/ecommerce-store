import prisma from '@/lib/prisma';
import { BrandsClient } from './BrandsClient';
import { requireAdminPermission } from '@/lib/permissions';



export default async function BrandsPage() {
  await requireAdminPermission('brands.view');
  const brands = await prisma.brand.findMany({
    orderBy: { nameEn: 'asc' },
  });

  return <BrandsClient brands={brands} />;
}
