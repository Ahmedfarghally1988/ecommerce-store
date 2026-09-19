import { ReactNode } from 'react';
import { AdminLayoutClient } from '@/components/admin/layout/AdminLayoutClient';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  let pendingCustomers = 0;
  let adminPermissions: string[] = [];
  let adminRole = '';
  let adminName = '';
  let adminEmail = '';
  let adminAvatar: string | null = null;

  try {
    const [pendingCount, session] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER', customerStatus: 'PENDING' } }).catch(() => 0),
      getAdminSession(),
    ]);
    pendingCustomers = pendingCount;

    if (session) {
      const adminUser = await prisma.adminUser.findUnique({
        where: { id: session.adminUserId },
        select: { name: true, email: true, avatar: true, role: true }
      });

      if (adminUser) {
        adminRole = adminUser.role;
        adminName = adminUser.name;
        adminEmail = adminUser.email;
        adminAvatar = adminUser.avatar;
      } else {
        adminRole = session.role;
        adminName = session.name || '';
        adminEmail = session.email || '';
        adminAvatar = session.avatar || null;
      }

      if (session.role === 'SUPER_ADMIN') {
        adminPermissions = ['*'];
      } else {
        const userPerms = await prisma.adminUserPermission.findMany({
          where: { adminUserId: session.adminUserId },
          include: { permission: true },
        });
        adminPermissions = userPerms.map((up) => up.permission.action);
      }
    }
  } catch {
    // Silently fail
  }

  return (
    <AdminLayoutClient
      pendingCustomers={pendingCustomers}
      adminPermissions={adminPermissions}
      adminRole={adminRole}
      adminName={adminName}
      adminEmail={adminEmail}
      adminAvatar={adminAvatar}
    >
      {children}
    </AdminLayoutClient>
  );
}
