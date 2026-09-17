import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createAdminSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validations/auth';



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const adminUser = await prisma.adminUser.findUnique({
      where: { email: validatedData.email },
    });

    if (!adminUser) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(validatedData.password, adminUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (adminUser.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Admin account is disabled.' }, { status: 403 });
    }

    await createAdminSession({
      adminUserId: adminUser.id,
      role: adminUser.role,
      email: adminUser.email,
      name: adminUser.name,
      avatar: adminUser.avatar,
    });

    return NextResponse.json({
      success: true,
      user: { id: adminUser.id, name: adminUser.name, email: adminUser.email, role: adminUser.role },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
