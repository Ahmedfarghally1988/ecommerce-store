"use server";

import prisma from '@/lib/prisma';
import { checkActionPermission } from '@/lib/permissions';

export async function getCurrencies() {
  await checkActionPermission('settings.view');
  return await prisma.currency.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createCurrency(data: any) {
  await checkActionPermission('settings.edit');
  try {
    if (data.isBase) {
      await prisma.currency.updateMany({ data: { isBase: false } });
      data.exchangeRate = 1;
    }
    const curr = await prisma.currency.create({
      data: {
        code: data.code,
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        symbol: data.symbol,
        exchangeRate: data.exchangeRate,
        isActive: data.isActive,
        isBase: data.isBase,
      }
    });
    return { success: true, currency: curr };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCurrency(id: string, data: any) {
  await checkActionPermission('settings.edit');
  try {
    if (data.isBase) {
      await prisma.currency.updateMany({ data: { isBase: false } });
      data.exchangeRate = 1;
    }
    const curr = await prisma.currency.update({
      where: { id },
      data: {
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        symbol: data.symbol,
        exchangeRate: data.exchangeRate,
        isActive: data.isActive,
        isBase: data.isBase,
      }
    });
    return { success: true, currency: curr };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCurrency(id: string) {
  await checkActionPermission('settings.edit');
  try {
    const curr = await prisma.currency.findUnique({ where: { id } });
    if (curr?.isBase) {
      return { success: false, error: 'لا يمكن حذف العملة الأساسية' };
    }
    await prisma.currency.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
