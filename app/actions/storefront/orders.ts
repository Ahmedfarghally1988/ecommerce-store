"use server";

import prisma from '@/lib/prisma';
import { getCustomerSession } from '@/lib/auth';

export async function getShippingSettings() {
  const settings = await prisma.setting.findMany();
  const settingsMap = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);
  
  let regions = [];
  try {
    if (settingsMap.shipping_regions) regions = JSON.parse(settingsMap.shipping_regions);
  } catch(e) {}

  return {
    baseCost: Number(settingsMap.shipping_base_cost || 0),
    freeThreshold: settingsMap.shipping_free_threshold ? Number(settingsMap.shipping_free_threshold) : null,
    regions: regions as { id?: string, name: string, cost: number }[],
  };
}

export async function validateCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  
  if (!coupon || !coupon.isActive) {
    return { success: false, error: 'الكوبون غير صالح أو غير مفعل' };
  }

  if (coupon.startsAt && new Date() < coupon.startsAt) {
    return { success: false, error: 'الكوبون لم يبدأ بعد' };
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return { success: false, error: 'انتهت صلاحية الكوبون' };
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { success: false, error: 'تجاوز الكوبون حد الاستخدام' };
  }

  if (coupon.minimumOrder && subtotal < Number(coupon.minimumOrder)) {
    return { success: false, error: `الحد الأدنى للطلب لاستخدام هذا الكوبون هو ${coupon.minimumOrder}` };
  }

  let discountAmount = 0;
  if (coupon.type === 'PERCENTAGE') {
    discountAmount = (subtotal * Number(coupon.value)) / 100;
    if (coupon.maximumDiscount && discountAmount > Number(coupon.maximumDiscount)) {
      discountAmount = Number(coupon.maximumDiscount);
    }
  } else {
    discountAmount = Number(coupon.value);
  }

  return { success: true, discountAmount, couponId: coupon.id };
}

export async function createCheckoutOrder(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  address: string;
  notes?: string;
  couponCode?: string;
  paymentMethod?: string;
  currency: string;
  exchangeRate: number;
  items: {
    productId: string;
    variantId?: string;
    productNameEn: string;
    productNameAr: string;
    sku: string;
    price: number;
    quantity: number;
  }[];
}) {
  try {
    const session = await getCustomerSession();
    
    // Calculate subtotal from items (which are in base currency)
    let baseSubtotal = 0;
    for (const item of data.items) {
      baseSubtotal += item.price * item.quantity;
    }
    
    // Central conversion utility isn't available directly here but logic is simple
    const exchangeRate = data.exchangeRate || 1;
    const subtotal = Number((baseSubtotal / exchangeRate).toFixed(2));

    // Apply Coupon (discount is calculated on base subtotal first)
    let baseDiscount = 0;
    let appliedCouponId = null;
    if (data.couponCode) {
      const couponCheck = await validateCoupon(data.couponCode, baseSubtotal);
      if (couponCheck.success && couponCheck.discountAmount) {
        baseDiscount = couponCheck.discountAmount;
        appliedCouponId = couponCheck.couponId;
      } else {
        return { success: false, error: couponCheck.error || 'Invalid coupon' };
      }
    }

    const discount = Number((baseDiscount / exchangeRate).toFixed(2));
    const baseSubtotalAfterDiscount = baseSubtotal - baseDiscount;

    // Calculate Shipping (base shipping cost)
    let baseShipping = 0;
    const settings = await prisma.setting.findMany();
    const settingsMap = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);
    
    const freeThreshold = settingsMap.shipping_free_threshold ? Number(settingsMap.shipping_free_threshold) : null;
    if (freeThreshold !== null && baseSubtotalAfterDiscount >= freeThreshold) {
      baseShipping = 0;
    } else {
      let regionCost = null;
      if (settingsMap.shipping_regions) {
        try {
          const regions = JSON.parse(settingsMap.shipping_regions);
          const region = regions.find((r: any) => r.name === data.city);
          if (region) {
            regionCost = Number(region.cost);
          }
        } catch(e) {}
      }

      if (regionCost !== null) {
        baseShipping = regionCost;
      } else if (settingsMap.shipping_base_cost) {
        baseShipping = Number(settingsMap.shipping_base_cost);
      }
    }

    const shipping = Number((baseShipping / exchangeRate).toFixed(2));
    
    const baseTax = 0;
    const tax = 0;
    
    const baseTotal = baseSubtotalAfterDiscount + baseShipping + baseTax;
    const total = subtotal - discount + shipping + tax;
    
    // Generate order number
    const dateStr = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 8);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomNum}`;
    
    const shippingAddress = {
      city: data.city,
      address: data.address,
    };
    
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.userId || null,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: data.paymentMethod || 'CASH_ON_DELIVERY',
        subtotal,
        discount,
        shipping,
        tax,
        total,
        currency: data.currency,
        exchangeRate: data.exchangeRate,
        baseSubtotal,
        baseDiscount,
        baseShipping,
        baseTax,
        baseTotal,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress,
        notes: data.notes,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            productNameEn: item.productNameEn,
            productNameAr: item.productNameAr,
            sku: item.sku,
            basePrice: item.price,
            baseTotal: item.price * item.quantity,
            price: Number((item.price / exchangeRate).toFixed(2)),
            quantity: item.quantity,
            total: Number(((item.price / exchangeRate) * item.quantity).toFixed(2)),
          }))
        }
      }
    });

    if (appliedCouponId) {
      await prisma.coupon.update({
        where: { id: appliedCouponId },
        data: { usedCount: { increment: 1 } }
      });
    }

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'NEW_ORDER',
        title: 'طلب جديد',
        message: `طلب جديد #${orderNumber} من ${data.customerName} (${data.customerPhone}) بقيمة ${total} جنيه`,
        link: `/admin/orders/${order.id}`,
      },
    }).catch(() => {});

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}
