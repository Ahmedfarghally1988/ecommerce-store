import prisma from '@/lib/prisma';
import { BannersClient } from './BannersClient';
import { requireAdminPermission } from '@/lib/permissions';

export default async function BannersPage() {
  await requireAdminPermission('banners.view');
  
  const banners = await prisma.banner.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return <BannersClient banners={banners} />;
}
