import { getMediaFiles } from '@/app/actions/admin/media';
import { requireAdminPermission } from '@/lib/permissions';
import { MediaClient } from './MediaClient';

export default async function MediaPage() {
  await requireAdminPermission('media.view');
  const files = await getMediaFiles();

  return <MediaClient initialFiles={files} />;
}
