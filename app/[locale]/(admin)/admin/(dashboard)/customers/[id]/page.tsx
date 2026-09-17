import { requireAdminPermission } from '@/lib/permissions';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CustomerEditClient from './CustomerEditClient';

export default async function CustomerEditPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  await requireAdminPermission('customers.view');
  
  const { id } = await params;
  
  const customer = await prisma.user.findUnique({
    where: { id, role: 'CUSTOMER' },
  });

  if (!customer) {
    notFound();
  }

  return <CustomerEditClient customer={customer} />;
}
