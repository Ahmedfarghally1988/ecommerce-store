import { NextResponse } from 'next/server';
import { deleteAdminSession } from '@/lib/auth';

export async function POST() {
  try {
    await deleteAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
