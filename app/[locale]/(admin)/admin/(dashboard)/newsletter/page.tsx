import { getNewsletterSubscribers } from '@/app/actions/admin/newsletter';
import NewsletterClient from './NewsletterClient';
import { requireAdminPermission } from '@/lib/permissions';

export default async function AdminNewsletterPage() {
  await requireAdminPermission('newsletter.view');
  const data = await getNewsletterSubscribers();

  return (
    <NewsletterClient
      initialSubscribers={data.subscribers}
      totalCount={data.totalCount}
      activeCount={data.activeCount}
    />
  );
}
