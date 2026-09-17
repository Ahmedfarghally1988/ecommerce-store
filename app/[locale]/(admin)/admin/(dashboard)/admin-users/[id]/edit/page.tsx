export const dynamic = 'force-dynamic';

import { getPermissionsList, getAdminUser } from '@/app/actions/admin/adminUsers';
import { getAdminSession } from '@/lib/auth';
import AdminUserForm from '../../AdminUserForm';
import { notFound } from 'next/navigation';

export default async function EditAdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [initialData, permissionsList, session] = await Promise.all([
    getAdminUser(id),
    getPermissionsList(),
    getAdminSession()
  ]);

  if (!initialData) {
    notFound();
  }

  return <AdminUserForm initialData={initialData} permissionsList={permissionsList} currentAdminRole={session?.role} />;
}
