"use server";

import prisma from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { checkActionPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';
import { getShippingSettings } from '@/app/actions/storefront/orders';





export async function updateOrderStatus(id: string, status: OrderStatus) {
  await checkActionPermission('orders.edit');
  
  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/orders');
  return JSON.parse(JSON.stringify(order));
}

export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
  await checkActionPermission('orders.edit');
  
  const order = await prisma.order.update({
    where: { id },
    data: { paymentStatus },
  });

  revalidatePath('/admin/orders');
  return JSON.parse(JSON.stringify(order));
}

export async function adminUpdateOrderAddress(id: string, newAddress: { city: string, address: string, apartment?: string, area?: string }) {
  await checkActionPermission('orders.edit');
  
  const order = await prisma.order.findUnique({
    where: { id }
  });

  if (!order) {
    throw new Error('Order not found');
  }

  const existingAddress: any = order.shippingAddress || {};

  // Calculate new shipping cost if city changed
  let newShipping = Number(order.shipping);
  if (newAddress.city && newAddress.city !== existingAddress.city) {
    const shippingSettings = await getShippingSettings();
    const region = shippingSettings.regions.find((r: any) => r.name === newAddress.city);
    
    let cost = shippingSettings.baseCost;
    if (region) {
      cost = Number(region.cost);
    }
    
    // Check free threshold based on subtotal - discount
    const subtotalAfterDiscount = Number(order.subtotal) - Number(order.discount);
    if (shippingSettings.freeThreshold !== null && subtotalAfterDiscount >= shippingSettings.freeThreshold) {
      cost = 0;
    }
    
    newShipping = cost;
  }

  const updatedAddress = {
    ...existingAddress,
    ...newAddress
  };

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { 
      shippingAddress: updatedAddress,
      shipping: newShipping,
      total: Number(order.subtotal) - Number(order.discount) + newShipping + Number(order.tax)
    },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  return JSON.parse(JSON.stringify(updatedOrder));
}
