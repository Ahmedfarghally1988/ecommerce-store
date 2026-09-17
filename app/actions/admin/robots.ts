"use server";

import prisma from '@/lib/prisma';
import { checkActionPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';

export async function getRobotsTxt() {
  await checkActionPermission('settings.view');
  const setting = await prisma.setting.findUnique({
    where: { key: 'robots_txt' }
  });
  return setting?.value || '';
}

export async function updateRobotsTxt(content: string) {
  await checkActionPermission('settings.edit');
  await prisma.setting.upsert({
    where: { key: 'robots_txt' },
    update: { value: content },
    create: { key: 'robots_txt', value: content },
  });
  revalidatePath('/admin/robots');
}
