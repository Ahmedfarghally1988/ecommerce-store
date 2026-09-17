import prisma from '@/lib/prisma';
import { requireAdminPermission } from '@/lib/permissions';
import { MessagesClient } from './MessagesClient';

export default async function MessagesPage() {
  await requireAdminPermission('settings.view');
  
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <MessagesClient initialMessages={messages} />;
}
