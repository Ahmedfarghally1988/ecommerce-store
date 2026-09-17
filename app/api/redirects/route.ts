import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const redirects = await prisma.redirect.findMany({
      select: {
        source: true,
        destination: true,
        isPermanent: true
      }
    });
    return NextResponse.json(redirects);
  } catch (error) {
    console.error('Error fetching redirects API:', error);
    return NextResponse.json([], { status: 500 });
  }
}
