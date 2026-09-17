import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { CountriesClient } from './CountriesClient';

export const metadata: Metadata = {
  title: 'إدارة الدول | لوحة التحكم',
  description: 'إدارة الدول والعملات المرتبطة بها',
};

export default async function CountriesPage() {
  const countries = await prisma.country.findMany({
    include: {
      currency: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const currencies = await prisma.currency.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return <CountriesClient countries={countries} currencies={currencies} />;
}
