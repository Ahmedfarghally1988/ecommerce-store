"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCustomerSession } from '@/lib/auth';
import { addressSchema } from '@/lib/validations/auth';



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

export async function getCustomerAddresses() {
  const session = await requireCustomer();
  const addresses = await prisma.address.findMany({
    where: { userId: session.userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
  return JSON.parse(JSON.stringify(addresses));
}

export async function createAddress(data: {
  firstName: string; lastName: string; phone: string; country: string;
  city: string; area?: string | null; address: string; apartment?: string | null;
  postalCode?: string | null; isDefault: boolean;
}) {
  const session = await requireCustomer();
  const parsed = addressSchema.parse(data);

  if (parsed.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.userId },
      data: { isDefault: false },
    });
  }

  const created = await prisma.address.create({
    data: { ...parsed, userId: session.userId },
  });

  revalidatePath('/account/addresses');
  return JSON.parse(JSON.stringify(created));
}

export async function updateAddress(id: string, data: {
  firstName: string; lastName: string; phone: string; country: string;
  city: string; area?: string | null; address: string; apartment?: string | null;
  postalCode?: string | null; isDefault: boolean;
}) {
  const session = await requireCustomer();

  const existing = await prisma.address.findFirst({ where: { id, userId: session.userId } });
  if (!existing) throw new Error('Address not found');

  const parsed = addressSchema.parse(data);

  if (parsed.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.userId, id: { not: id } },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id },
    data: parsed,
  });

  revalidatePath('/account/addresses');
  return JSON.parse(JSON.stringify(updated));
}

export async function deleteAddress(id: string) {
  const session = await requireCustomer();
  const existing = await prisma.address.findFirst({ where: { id, userId: session.userId } });
  if (!existing) throw new Error('Address not found');

  await prisma.address.delete({ where: { id } });
  revalidatePath('/account/addresses');
  return { success: true };
}

export async function setDefaultAddress(id: string) {
  const session = await requireCustomer();
  const existing = await prisma.address.findFirst({ where: { id, userId: session.userId } });
  if (!existing) throw new Error('Address not found');

  await prisma.address.updateMany({
    where: { userId: session.userId },
    data: { isDefault: false },
  });
  await prisma.address.update({ where: { id }, data: { isDefault: true } });

  revalidatePath('/account/addresses');
  return { success: true };
}
