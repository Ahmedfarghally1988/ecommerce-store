import { getCustomers, getPendingCustomerCount } from '@/app/actions/admin/customers';
import CustomersClient from './CustomersClient';
import { requireAdminPermission } from '@/lib/permissions';

export default async function AdminCustomersPage() {
  await requireAdminPermission('customers.view');
  const [allCustomers, pendingCount] = await Promise.all([
    getCustomers('ALL'),
    getPendingCustomerCount(),
  ]);

  return <CustomersClient initialCustomers={allCustomers} pendingCount={pendingCount} />;
}
