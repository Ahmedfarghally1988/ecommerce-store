import prisma from '@/lib/prisma';
import { CurrenciesClient } from './CurrenciesClient';
import { requireAdminPermission } from '@/lib/permissions';

export default async function CurrenciesPage() {
  await requireAdminPermission('settings.view');
  
  const currencies = await prisma.currency.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <CurrenciesClient currencies={currencies} />;
}
