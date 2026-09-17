"use server";

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { getCustomerSession } from '@/lib/auth';
import { profileUpdateSchema, changePasswordSchema } from '@/lib/validations/auth';



async function requireCustomer() {
  const session = await getCustomerSession();
  if (!session || session.role !== 'CUSTOMER') {
    throw new Error('Unauthorized: Customer session required');
  }
  if (session.customerStatus !== 'APPROVED') {
    throw new Error('Account not approved');
  }
  return session;
}

export async function getCustomerProfile() {
  const session = await requireCustomer();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      customerStatus: true,
      createdAt: true,
    },
  });
  if (!user) throw new Error('User not found');
  return JSON.parse(JSON.stringify(user));
}

export async function updateCustomerProfile(data: { name: string; phone?: string; avatar?: string | null }) {
  const session = await requireCustomer();
  const parsed = profileUpdateSchema.parse(data);

  const updated = await prisma.user.update({
    where: { id: session.userId },
    data: {
      name: parsed.name,
      phone: parsed.phone || null,
      avatar: parsed.avatar || null,
    },
    select: { id: true, name: true, email: true, phone: true, avatar: true },
  });

  revalidatePath('/account');
  return JSON.parse(JSON.stringify(updated));
}

export async function changeCustomerPassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) {
  const session = await requireCustomer();
  changePasswordSchema.parse(data);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { password: true },
  });
  if (!user) throw new Error('User not found');

  const isValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isValid) throw new Error('Current password is incorrect');

  const hashed = await bcrypt.hash(data.newPassword, 12);
  await prisma.user.update({
    where: { id: session.userId },
    data: { password: hashed },
  });

  return { success: true };
}
