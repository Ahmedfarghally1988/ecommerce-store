"use server";

import prisma from '@/lib/prisma';
import { settingsSchema, SettingsInput } from '@/lib/validations/admin';
import { checkActionPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';





export async function updateSettings(data: SettingsInput) {
  await checkActionPermission('settings.edit');
  const parsed = settingsSchema.parse(data);

  for (const [key, value] of Object.entries(parsed)) {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    await prisma.setting.upsert({
      where: { key },
      update: { value: stringValue },
      create: { key, value: stringValue },
    });
  }

  revalidatePath('/admin/settings');
  return true;
}
