import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hasAdminPermission } from '@/lib/permissions';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const hasPermission = await hasAdminPermission('settings.edit');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { code, nameEn, nameAr, currencyId, isActive } = body;

    if (!code || !nameEn || !nameAr || !currencyId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const country = await prisma.country.update({
      where: { id },
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

    return NextResponse.json({ country });
  } catch (error: any) {
    console.error('Error updating country:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Country code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const hasPermission = await hasAdminPermission('settings.edit');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.country.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Country deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting country:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
