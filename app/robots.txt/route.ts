import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const setting = await prisma.setting.findUnique({
    where: { key: 'robots_txt' }
  });

  const content = setting?.value || "User-agent: *\nAllow: /\n";

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
