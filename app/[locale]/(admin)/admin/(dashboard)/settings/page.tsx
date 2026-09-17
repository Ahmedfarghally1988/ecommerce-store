import prisma from '@/lib/prisma';
import { SettingsClient } from './SettingsClient';
import { requireAdminPermission } from '@/lib/permissions';



export default async function SettingsPage() {
  await requireAdminPermission('settings.view');
  const settingsRecords = await prisma.setting.findMany();
  
  // Convert array of {key, value} into a simple object {key: value}
  const settingsObj = settingsRecords.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return <SettingsClient initialSettings={settingsObj} />;
}
