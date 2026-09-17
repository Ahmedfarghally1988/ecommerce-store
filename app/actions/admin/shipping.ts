"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { shippingSchema } from '@/lib/validations/admin';

export async function updateShippingSettings(data: unknown) {
  try {
    const validatedData = shippingSchema.parse(data);

    // Save each key-value pair to the Setting model
    const updates = Object.entries(validatedData).map(([key, value]) => {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value || '');
      
      return prisma.setting.upsert({
        where: { key },
        update: { value: stringValue },
        create: { key, value: stringValue },
      });
    });

    await prisma.$transaction(updates);

    revalidatePath('/admin/shipping');
    revalidatePath('/[locale]/(storefront)', 'layout');

    return { success: true };
  } catch (error: any) {
    console.error('Failed to update shipping settings:', error);
    return { success: false, error: error.message };
  }
}
