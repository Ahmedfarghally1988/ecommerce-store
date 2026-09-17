"use server";

import { prisma } from '@/lib/prisma';
import { getCustomerSession } from '@/lib/auth';

export async function getCustomerAddresses() {
  const session = await getCustomerSession();
  
  if (!session || !session.userId) {
    return { addresses: [], email: '' };
  }

  try {
    const addresses = await prisma.address.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: {
        isDefault: 'desc',
      },
    });
    return { addresses, email: session.email };
  } catch (error) {
    console.error("Failed to fetch customer addresses:", error);
    return { addresses: [], email: '' };
  }
}
