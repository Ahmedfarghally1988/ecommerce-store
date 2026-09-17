import { NextResponse } from 'next/server';
import { deleteCustomerSession } from '@/lib/auth';

export async function POST() {
  try {
    await deleteCustomerSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Customer logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
