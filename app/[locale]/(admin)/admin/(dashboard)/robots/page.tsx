import { getRobotsTxt } from '@/app/actions/admin/robots';
import { RobotsClient } from './RobotsClient';
import { requireAdminPermission } from '@/lib/permissions';

export default async function RobotsPage() {
  await requireAdminPermission('settings.view');
  const robotsContent = await getRobotsTxt();

  return <RobotsClient initialContent={robotsContent} />;
}
