import { getRedirects } from '@/app/actions/admin/redirects';
import { RedirectsClient } from './RedirectsClient';
import { requireAdminPermission } from '@/lib/permissions';

export default async function RedirectsPage() {
  await requireAdminPermission('settings.view');
  const redirects = await getRedirects();

  return <RedirectsClient redirects={redirects} />;
}
