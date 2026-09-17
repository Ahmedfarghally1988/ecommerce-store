export const dynamic = 'force-dynamic';

import { getAdminUsers, getPermissionsList } from '@/app/actions/admin/adminUsers';
import { getAdminSession } from '@/lib/auth';
import AdminUsersClient from './AdminUsersClient';
import { requireAdminPermission } from '@/lib/permissions';

export default async function AdminUsersPage() {
  await requireAdminPermission('admin_users.view');
  
  const [users, permissionsList, session] = await Promise.all([
    getAdminUsers(),
    getPermissionsList(),
    getAdminSession(),
  ]);

  return (
    <AdminUsersClient
      initialUsers={users}
      permissionsList={permissionsList}
      currentAdminRole={session?.role ?? ''}
    />
  );
}
