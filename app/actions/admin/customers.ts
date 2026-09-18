"use server";

import prisma from '@/lib/prisma';
import { checkActionPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';



export async function getCustomers(filter?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'ALL') {
  await checkActionPermission('customers.view');
  const where = filter && filter !== 'ALL' ? { role: 'CUSTOMER' as const, customerStatus: filter } : { role: 'CUSTOMER' as const };

  const customers = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      customerStatus: true,
      status: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return JSON.parse(JSON.stringify(customers));
}

export async function getPendingCustomerCount() {
  await checkActionPermission('customers.view');
  return prisma.user.count({ where: { role: 'CUSTOMER', customerStatus: 'PENDING' } });
}

export async function approveCustomer(id: string) {
  await checkActionPermission('customers.approve');
  const updated = await prisma.user.update({
    where: { id },
    data: { customerStatus: 'APPROVED', status: true },
  });
  revalidatePath('/admin/customers');
  return JSON.parse(JSON.stringify(updated));
}

export async function rejectCustomer(id: string) {
  await checkActionPermission('customers.approve');
  const updated = await prisma.user.update({
    where: { id },
    data: { customerStatus: 'REJECTED' },
  });
  revalidatePath('/admin/customers');
  return JSON.parse(JSON.stringify(updated));
}

export async function suspendCustomer(id: string) {
  await checkActionPermission('customers.suspend');
  const updated = await prisma.user.update({
    where: { id },
    data: { customerStatus: 'SUSPENDED', status: false },
  });
  revalidatePath('/admin/customers');
  return JSON.parse(JSON.stringify(updated));
}

export async function activateCustomer(id: string) {
  await checkActionPermission('customers.approve');
  const updated = await prisma.user.update({
    where: { id },
    data: { customerStatus: 'APPROVED', status: true },
  });
  revalidatePath('/admin/customers');
  return JSON.parse(JSON.stringify(updated));
}

import bcrypt from 'bcryptjs';

export async function updateCustomerAdmin(id: string, data: { name: string; email: string; phone: string; avatar: string; password?: string }) {
  await checkActionPermission('customers.approve'); // Or a specific edit permission
  
  const updateData: any = {
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    avatar: data.avatar || null,
  };

  if (data.password && data.password.trim() !== '') {
    updateData.password = await bcrypt.hash(data.password, 12);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
  });
  revalidatePath('/admin/customers');
  revalidatePath(`/admin/customers/${id}`);
  return JSON.parse(JSON.stringify(updated));
}

export async function deleteCustomer(id: string) {
  await checkActionPermission('customers.delete');
  const deleted = await prisma.user.delete({ where: { id } });
  revalidatePath('/admin/customers');
  return JSON.parse(JSON.stringify(deleted));
}

