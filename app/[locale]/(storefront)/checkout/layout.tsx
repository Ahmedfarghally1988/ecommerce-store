import React from 'react';
import { getCustomerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function CheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getCustomerSession();

  if (!session || session.role !== 'CUSTOMER' || session.customerStatus !== 'APPROVED') {
    redirect(`/${locale}/login?callbackUrl=/${locale}/checkout`);
  }

  return <>{children}</>;
}
