import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createCustomerSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validations/auth';



const STATUS_MESSAGES: Record<string, string> = {
  PENDING: 'Your account is pending admin approval. You will be notified once approved.',
  REJECTED: 'Your account has been rejected. Please contact support for more information.',
  SUSPENDED: 'Your account has been suspended. Please contact support.',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user || user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check approval status
    if (user.customerStatus !== 'APPROVED') {
      return NextResponse.json(
        {
          error: STATUS_MESSAGES[user.customerStatus] || 'Account is not active.',
          customerStatus: user.customerStatus,
        },
        { status: 403 }
      );
    }

    // Check if account is disabled
    if (!user.status) {
      return NextResponse.json({ error: 'Account is disabled. Please contact support.' }, { status: 403 });
    }

    await createCustomerSession({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      customerStatus: user.customerStatus,
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Customer login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
