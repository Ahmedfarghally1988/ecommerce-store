import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { requireAdminPermission } from '@/lib/permissions';
import { OrderDetailsClient } from './OrderDetailsClient';

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPermission('orders.view');

  const resolvedParams = await params;
  if (!resolvedParams?.id) return notFound();

  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      items: true,
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Need to stringify/parse to pass safely to Client Component because of Decimal / Date
  const safeOrder = JSON.parse(JSON.stringify(order));

  return <OrderDetailsClient order={safeOrder} />;
}
