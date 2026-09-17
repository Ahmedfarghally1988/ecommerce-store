import { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
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
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <AdminSidebar
          pendingCustomers={pendingCustomers}
          adminPermissions={adminPermissions}
          adminRole={adminRole}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <AdminHeader adminName={adminName} adminEmail={adminEmail} adminAvatar={adminAvatar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
