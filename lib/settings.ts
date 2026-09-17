import prisma from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const getStoreCurrency = unstable_cache(async () => {
  try {
    const currencySetting = await prisma.setting.findUnique({ where: { key: 'currency' } });
    return currencySetting?.value || 'EGP';
  } catch {
    return 'EGP';
  }
}, ['store-currency'], { revalidate: 60, tags: ['settings'] });

export const getStoreSettings = unstable_cache(async () => {
  try {
    const settingsRecords = await prisma.setting.findMany();
    return settingsRecords.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch {
    return {};
  }
}, ['store-settings'], { revalidate: 60, tags: ['settings'] });
