import prisma from '@/lib/prisma';
import { SlidersClient } from './SlidersClient';
import { requireAdminPermission } from '@/lib/permissions';



export default async function SlidersPage() {
  await requireAdminPermission('dashboard.view');
  const slides = await prisma.heroSlide.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return <SlidersClient initialSlides={slides} />;
}
