'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkActionPermission } from '@/lib/permissions';

export async function createCountry(data: any) {
  try {
    await checkActionPermission('settings.edit');

    const country = await prisma.country.create({
      data: {
        code: data.code,
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        currencyId: data.currencyId,
        isActive: data.isActive,
      }
    });

    revalidatePath('/[locale]/(admin)/admin/(dashboard)/countries', 'page');
    revalidatePath('/', 'layout');
    
    return { success: true, data: country };
  } catch (error: any) {
    console.error('Failed to create country:', error);
    if (error.code === 'P2002') return { success: false, error: 'Country code already exists' };
    return { success: false, error: 'Failed to create country' };
  }
}

export async function updateCountry(id: string, data: any) {
  try {
    await checkActionPermission('settings.edit');

    const country = await prisma.country.update({
      where: { id },
      data: {
        code: data.code,
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        currencyId: data.currencyId,
        isActive: data.isActive,
      }
    });

    revalidatePath('/[locale]/(admin)/admin/(dashboard)/countries', 'page');
    revalidatePath('/', 'layout');
    
    return { success: true, data: country };
  } catch (error: any) {
    console.error('Failed to update country:', error);
    if (error.code === 'P2002') return { success: false, error: 'Country code already exists' };
    return { success: false, error: 'Failed to update country' };
  }
}

export async function deleteCountry(id: string) {
  try {
    await checkActionPermission('settings.edit');

    await prisma.country.delete({
      where: { id }
    });

    revalidatePath('/[locale]/(admin)/admin/(dashboard)/countries', 'page');
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete country:', error);
    return { success: false, error: 'Failed to delete country' };
  }
}
