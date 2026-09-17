import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    let setting = await prisma.setting.findUnique({
      where: { key: 'site_visits' },
    });

    if (!setting) {
      setting = await prisma.setting.create({
        data: { key: 'site_visits', value: '1' }
      });
      return NextResponse.json({ success: true, count: 1 });
    }

    const currentValue = parseInt(setting.value || '0', 10);
    const newValue = (currentValue + 1).toString();

    await prisma.setting.update({
      where: { key: 'site_visits' },
      data: { value: newValue }
    });

    return NextResponse.json({ success: true, count: newValue });
  } catch (error) {
    console.error('Failed to track visit:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
