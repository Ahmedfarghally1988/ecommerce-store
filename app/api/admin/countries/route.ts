import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hasAdminPermission } from '@/lib/permissions';

export async function GET(req: NextRequest) {
  try {
    const hasPermission = await hasAdminPermission('settings.view');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const countries = await prisma.country.findMany({
      include: {
        currency: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ countries });
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const hasPermission = await hasAdminPermission('settings.edit');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { code, nameEn, nameAr, currencyId, isActive } = body;

    if (!code || !nameEn || !nameAr || !currencyId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const country = await prisma.country.create({
      data: {
        code,
        nameEn,
        nameAr,
        currencyId,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        currency: true,
      }
    });

    return NextResponse.json({ country }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating country:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Country code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
