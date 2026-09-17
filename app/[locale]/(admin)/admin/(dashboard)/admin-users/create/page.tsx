export const dynamic = 'force-dynamic';

import { getPermissionsList } from '@/app/actions/admin/adminUsers';
import { getAdminSession } from '@/lib/auth';
import AdminUserForm from '../AdminUserForm';

export default async function CreateAdminUserPage() {
  const [permissionsList, session] = await Promise.all([
    getPermissionsList(),
    getAdminSession()
  ]);

  return <AdminUserForm permissionsList={permissionsList} currentAdminRole={session?.role} />;
}
