"use server";

import prisma from '@/lib/prisma';
import { checkActionPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';

export async function getRedirects() {
  await checkActionPermission('settings.view');
  return prisma.redirect.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createRedirect(data: { source: string, destination: string, isPermanent?: boolean }) {
  await checkActionPermission('settings.edit');
  await prisma.redirect.create({
    data: {
      source: data.source,
      destination: data.destination,
      isPermanent: data.isPermanent ?? true,
    }
  });
  revalidatePath('/admin/redirects');
}

export async function updateRedirect(id: string, data: { source: string, destination: string, isPermanent?: boolean }) {
  await checkActionPermission('settings.edit');
  await prisma.redirect.update({
    where: { id },
    data: {
      source: data.source,
      destination: data.destination,
      isPermanent: data.isPermanent ?? true,
    }
  });
  revalidatePath('/admin/redirects');
}

export async function deleteRedirect(id: string) {
  await checkActionPermission('settings.edit');
  await prisma.redirect.delete({ where: { id } });
  revalidatePath('/admin/redirects');
}
