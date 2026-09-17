import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations/auth';



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        password: hashedPassword,
        role: 'CUSTOMER',
        customerStatus: 'PENDING',
        status: true,
      },
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'NEW_CUSTOMER',
        title: 'عميل جديد',
        message: `قام ${user.name} (${user.email}) بالتسجيل وينتظر الموافقة`,
        link: '/admin/customers',
      },
    }).catch(() => {}); // Don't fail registration if notification fails

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please wait for admin approval before logging in.',
      user: { id: user.id, name: user.name, email: user.email },
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error?.message || error) }, { status: 500 });
  }
}
