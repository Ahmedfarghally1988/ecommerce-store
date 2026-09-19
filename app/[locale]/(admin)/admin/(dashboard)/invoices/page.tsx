import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/permissions';
import { InvoicesClient } from './InvoicesClient';
import { getInvoices } from '@/app/actions/admin/invoices';

export const dynamic = 'force-dynamic';

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAdminPermission('orders.view'); // Invoices generally fall under orders permission

  const resolvedParams = await searchParams;
  const filters = {
    month: resolvedParams.month as string | undefined,
    dateFrom: resolvedParams.dateFrom as string | undefined,
    dateTo: resolvedParams.dateTo as string | undefined,
    orderNumber: resolvedParams.orderNumber as string | undefined,
    invoiceNumber: resolvedParams.invoiceNumber as string | undefined,
  };

  const response = await getInvoices(filters);
  const invoices = response.success ? response.data : [];

  return <InvoicesClient initialInvoices={invoices || []} currentFilters={filters} />;
}
