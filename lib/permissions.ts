import prisma from '@/lib/prisma';
import { getAdminSession } from './auth';
import { forbidden } from 'next/navigation';
import { cache } from 'react';

export const hasAdminPermission = cache(async (permission: string): Promise<boolean> => {
  const session = await getAdminSession();
  if (!session) return false;

  // SUPER_ADMIN has full permissions, skip DB query
  if (session.role === 'SUPER_ADMIN') {
    return true;
  }

  const adminUser = await prisma.adminUser.findUnique({
    where: { id: session.adminUserId },
    include: {
      permissions: {
        where: {
          permission: { action: permission }
        }
      }
    }
  });

  if (!adminUser || adminUser.status !== 'ACTIVE') {
    return false;
  }

  return adminUser.permissions.length > 0;
});

export async function requireAdminPermission(permission: string) {
  const hasAccess = await hasAdminPermission(permission);
  if (!hasAccess) {
    forbidden();
  }
}

export async function checkActionPermission(permission: string) {
  const hasAccess = await hasAdminPermission(permission);
  if (!hasAccess) {
    throw new Error('عفواً، ليس لديك صلاحية للقيام بهذا الإجراء. يرجى التواصل مع المدير العام.');
  }
}
