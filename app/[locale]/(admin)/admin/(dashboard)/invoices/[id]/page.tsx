import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/permissions';
import { InvoicePrintClient } from './InvoicePrintClient';
import { getInvoiceById } from '@/app/actions/admin/invoices';
import { getStoreSettings } from '@/lib/settings';

export default async function InvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPermission('orders.view');

  const resolvedParams = await params;
  if (!resolvedParams?.id) return notFound();

  const response = await getInvoiceById(resolvedParams.id);
  
  if (!response.success || !response.data) {
    notFound();
  }

  // Get store settings for the logo and store name
  const storeSettings = await getStoreSettings();

  // Need to stringify/parse to pass safely to Client Component because of Decimal / Date
  const safeInvoice = JSON.parse(JSON.stringify(response.data));

  return <InvoicePrintClient invoice={safeInvoice} storeSettings={storeSettings} />;
}
