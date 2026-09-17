import prisma from '@/lib/prisma';
import { OrdersClient } from './OrdersClient';
import { requireAdminPermission } from '@/lib/permissions';



export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAdminPermission('orders.view');
  
  const resolvedSearchParams = await searchParams;
  const userId = resolvedSearchParams?.userId as string | undefined;
  
  const orders = await prisma.order.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return <OrdersClient orders={JSON.parse(JSON.stringify(orders))} />;
}
