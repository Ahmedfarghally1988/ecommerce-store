import prisma from '@/lib/prisma';
import { CouponsClient } from './CouponsClient';
import { requireAdminPermission } from '@/lib/permissions';



export default async function CouponsPage() {
  await requireAdminPermission('coupons.view');
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const serializedCoupons = coupons.map(coupon => ({
    ...coupon,
    value: Number(coupon.value),
    minimumOrder: coupon.minimumOrder ? Number(coupon.minimumOrder) : null,
    maximumDiscount: coupon.maximumDiscount ? Number(coupon.maximumDiscount) : null,
  }));

  return <CouponsClient coupons={serializedCoupons as any} />;
}
