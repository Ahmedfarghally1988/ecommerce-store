import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { ShippingClient } from './ShippingClient';
import { requireAdminPermission } from '@/lib/permissions';

export const metadata: Metadata = {
  title: 'الشحن والتوصيل | لوحة التحكم',
};

export default async function AdminShippingPage() {
  await requireAdminPermission('settings.view');

  // Fetch only shipping-related settings
  const shippingSettingsRecords = await prisma.setting.findMany({
    where: {
      key: {
        in: ['shipping_base_cost', 'shipping_free_threshold', 'shipping_regions']
      }
    }
  });

  const shippingSettings = shippingSettingsRecords.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="mx-auto max-w-6xl">
      <ShippingClient initialSettings={shippingSettings} />
    </div>
  );
}
