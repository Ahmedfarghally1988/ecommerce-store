import { redirect } from 'next/navigation';
import { getCustomerSession } from '@/lib/auth';
import React from 'react';

export default async function LoginLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getCustomerSession();

  // If already logged in, redirect to home page
  if (session?.role === 'CUSTOMER' && session?.customerStatus === 'APPROVED') {
    redirect(`/${locale}`);
  }

  return <>{children}</>;
}
