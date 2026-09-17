"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkActionPermission } from '@/lib/permissions';

export async function markMessageAsRead(id: string) {
  try {
    await checkActionPermission('settings.view');
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    revalidatePath('/[locale]/(admin)/admin/messages', 'page');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMessage(id: string) {
  try {
    await checkActionPermission('settings.view');
    await prisma.contactMessage.delete({
      where: { id },
    });
    revalidatePath('/[locale]/(admin)/admin/messages', 'page');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
