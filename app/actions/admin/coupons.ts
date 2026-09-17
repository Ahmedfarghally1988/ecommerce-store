"use server";

import prisma from '@/lib/prisma';
import { couponSchema, CouponInput } from '@/lib/validations/admin';
import { checkActionPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';





export async function createCoupon(data: CouponInput) {
  await checkActionPermission('coupons.create');
  const parsed = couponSchema.parse(data);

  const coupon = await prisma.coupon.create({
    data: {
      ...parsed,
      startsAt: parsed.startsAt ? new Date(parsed.startsAt) : null,
      expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
    },
  });

  revalidatePath('/admin/coupons');
  return coupon;
}

export async function updateCoupon(id: string, data: CouponInput) {
  await checkActionPermission('coupons.edit');
  const parsed = couponSchema.parse(data);

  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      ...parsed,
      startsAt: parsed.startsAt ? new Date(parsed.startsAt) : null,
      expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
    },
  });

  revalidatePath('/admin/coupons');
  return coupon;
}

export async function deleteCoupon(id: string) {
  await checkActionPermission('coupons.delete');
  
  await prisma.coupon.delete({
    where: { id },
  });

  revalidatePath('/admin/coupons');
  return true;
}
