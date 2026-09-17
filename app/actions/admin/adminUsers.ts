"use server";

import prisma from '@/lib/prisma';
import { checkActionPermission } from '@/lib/permissions';
import { getAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';



export async function getAdminUsers() {
  await checkActionPermission('admin_users.view');
  
  const users = await prisma.adminUser.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      avatar: true,
      createdAt: true,
      _count: { select: { permissions: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  return JSON.parse(JSON.stringify(users));
}

export async function getAdminUser(id: string) {
  await checkActionPermission('admin_users.view');
  
  const user = await prisma.adminUser.findUnique({
    where: { id },
    include: {
      permissions: {
        include: { permission: true }
      }
    }
  });
  
  if (user) {
    // don't send password hash to client
    (user as any).password = undefined;
  }
  
  return JSON.parse(JSON.stringify(user));
}

export async function getPermissionsList() {
  await checkActionPermission('admin_users.view');
  
  const permissions = await prisma.permission.findMany({
    orderBy: { action: 'asc' },
  });
  return permissions;
}

export async function createAdminUser(data: any) {
  await checkActionPermission('admin_users.create');
  const session = await getAdminSession();
  
  // Privilege escalation check
  if (data.role === 'SUPER_ADMIN' && session!.role !== 'SUPER_ADMIN') {
    throw new Error('Only SUPER_ADMIN can create another SUPER_ADMIN');
  }

  const existing = await prisma.adminUser.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('Email already exists');

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newAdmin = await prisma.adminUser.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      status: data.status,
      avatar: data.avatar || null,
      permissions: {
        create: data.permissions?.map((permId: string) => ({
          permission: { connect: { id: permId } }
        })) || []
      }
    }
  });

  revalidatePath('/admin/admin-users');
  return { success: true };
}

export async function updateAdminUser(id: string, data: any) {
  await checkActionPermission('admin_users.edit');
  const session = await getAdminSession();

  const targetUser = await prisma.adminUser.findUnique({ where: { id } });
  if (!targetUser) throw new Error('User not found');

  // Privilege checks
  if (targetUser.role === 'SUPER_ADMIN' && session!.role !== 'SUPER_ADMIN') {
    throw new Error('ADMIN cannot modify SUPER_ADMIN');
  }

  if (data.role === 'SUPER_ADMIN' && session!.role !== 'SUPER_ADMIN') {
    throw new Error('ADMIN cannot grant SUPER_ADMIN role');
  }

  const updateData: any = {
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    avatar: data.avatar || null,
  };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  // Update user details
  await prisma.adminUser.update({
    where: { id },
    data: updateData
  });

  // Update permissions explicitly (delete all and recreate)
  if (data.permissions) {
    // Only those with admin_users.permissions can modify permissions
    await checkActionPermission('admin_users.permissions');
    
    await prisma.adminUserPermission.deleteMany({
      where: { adminUserId: id }
    });

    if (data.permissions.length > 0) {
      await prisma.adminUserPermission.createMany({
        data: data.permissions.map((permId: string) => ({
          adminUserId: id,
          permissionId: permId,
        }))
      });
    }
  }

  revalidatePath('/admin/admin-users');
  revalidatePath(`/admin/admin-users/${id}/edit`);
  return { success: true };
}

export async function suspendAdminUser(id: string) {
  await checkActionPermission('admin_users.edit');
  const session = await getAdminSession();

  if (session!.adminUserId === id) {
    throw new Error('You cannot suspend yourself');
  }

  const targetUser = await prisma.adminUser.findUnique({ where: { id } });
  if (targetUser?.role === 'SUPER_ADMIN' && session!.role !== 'SUPER_ADMIN') {
    throw new Error('ADMIN cannot suspend SUPER_ADMIN');
  }

  await prisma.adminUser.update({
    where: { id },
    data: { status: 'SUSPENDED' },
  });

  revalidatePath('/admin/admin-users');
  return { success: true };
}

export async function activateAdminUser(id: string) {
  await checkActionPermission('admin_users.edit');
  const session = await getAdminSession();

  const targetUser = await prisma.adminUser.findUnique({ where: { id } });
  if (targetUser?.role === 'SUPER_ADMIN' && session!.role !== 'SUPER_ADMIN') {
    throw new Error('ADMIN cannot activate SUPER_ADMIN');
  }

  await prisma.adminUser.update({
    where: { id },
    data: { status: 'ACTIVE' },
  });

  revalidatePath('/admin/admin-users');
  return { success: true };
}

export async function deleteAdminUser(id: string) {
  await checkActionPermission('admin_users.delete');
  const session = await getAdminSession();

  if (session!.adminUserId === id) {
    throw new Error('You cannot delete yourself');
  }

  const targetUser = await prisma.adminUser.findUnique({ where: { id } });
  if (targetUser?.role === 'SUPER_ADMIN') {
    throw new Error('SUPER_ADMIN cannot be deleted');
  }

  await prisma.adminUser.delete({
    where: { id },
  });

  revalidatePath('/admin/admin-users');
  return { success: true };
}
