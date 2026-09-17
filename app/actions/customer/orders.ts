"use server";

import prisma from '@/lib/prisma';
import { getCustomerSession } from '@/lib/auth';
import { getShippingSettings } from '@/app/actions/storefront/orders';



async function requireCustomer() {
  const session = await getCustomerSession();
  if (!session || session.role !== 'CUSTOMER') {
    throw new Error('Unauthorized: Customer session required');
  }
  if (session.customerStatus !== 'APPROVED') {
    throw new Error('Account not approved');
  }
  return session;
}

export async function getCustomerOrders() {
  const session = await requireCustomer();
  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return JSON.parse(JSON.stringify(orders));
}

export async function cancelCustomerOrder(orderId: string, reason?: string) {
  const session = await requireCustomer();
  
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order || order.userId !== session.userId) {
    throw new Error('Order not found or unauthorized');
  }

  if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
    throw new Error('Order cannot be cancelled at this stage');
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'CANCELLED',
      cancelReason: reason || null,
    }
  });

  // Create notification for admin
  await prisma.notification.create({
    data: {
      type: 'ORDER_CANCELLED',
      title: 'طلب ملغي',
      message: `قام العميل بإلغاء الطلب رقم #${order.orderNumber}`,
      link: `/admin/orders/${order.id}`,
    }
  }).catch(() => {});

  return JSON.parse(JSON.stringify(updatedOrder));
}

export async function updateCustomerOrderAddress(orderId: string, newAddress: { city: string, address: string, apartment?: string, area?: string }) {
  const session = await requireCustomer();
  
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order || order.userId !== session.userId) {
    throw new Error('Order not found or unauthorized');
  }

  if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
    throw new Error('Cannot update address at this stage');
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
    where: { id: orderId },
    data: {
      shippingAddress: updatedAddress,
      shipping: newShipping,
      total: Number(order.subtotal) - Number(order.discount) + newShipping + Number(order.tax)
    }
  });

  // Create notification for admin
  await prisma.notification.create({
    data: {
      type: 'ORDER_UPDATED',
      title: 'تعديل عنوان طلب',
      message: `قام العميل بتعديل عنوان الشحن للطلب رقم #${order.orderNumber}`,
      link: `/admin/orders/${order.id}`,
    }
  }).catch(() => {});

  return JSON.parse(JSON.stringify(updatedOrder));
}
