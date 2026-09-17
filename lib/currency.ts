import prisma from '@/lib/prisma';
import { cache } from 'react';
import { Currency, Country } from '@prisma/client';
import { cookies } from 'next/headers';

export const getCurrencies = cache(async (): Promise<Currency[]> => {
  try {
    return await prisma.currency.findMany({
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return [];
  }
});

export const getActiveCurrencies = cache(async (): Promise<Currency[]> => {
  try {
    return await prisma.currency.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching active currencies:', error);
    return [];
  }
});

export const getBaseCurrency = cache(async (): Promise<Currency | null> => {
  try {
    return await prisma.currency.findFirst({
      where: { isBase: true },
    });
  } catch (error) {
    console.error('Error fetching base currency:', error);
    return null;
  }
});

export const getCustomerCurrency = cache(async (): Promise<Currency | null> => {
  try {
    const cookieStore = await cookies();
    const countryCode = cookieStore.get('USER_COUNTRY')?.value;
    
    if (countryCode) {
      const country = await prisma.country.findUnique({
        where: { code: countryCode },
        include: { currency: true }
      });
      if (country && country.isActive && country.currency?.isActive) {
        return country.currency;
      }
    }
    
    // Fallback to base currency if no country is selected
    return await getBaseCurrency();
  } catch (error) {
    console.error('Error fetching customer currency:', error);
    return null;
  }
});

export const getCustomerCountry = cache(async (): Promise<(Country & { currency: Currency | null }) | null> => {
  try {
    const cookieStore = await cookies();
    const countryCode = cookieStore.get('USER_COUNTRY')?.value;
    
    if (countryCode) {
      const country = await prisma.country.findUnique({
        where: { code: countryCode },
        include: { currency: true }
      });
      if (country && country.isActive) {
        return country;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching customer country:', error);
    return null;
  }
});
