import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production-1234567890';
const key = new TextEncoder().encode(JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    // Find the latest OTP for this email
    const otpRecord = await prisma.otpCode.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' }
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid or expired code.' }, { status: 400 });
    }

    if (otpRecord.code !== code) {
      return NextResponse.json({ error: 'Incorrect code.' }, { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: 'Code has expired. Please register again.' }, { status: 400 });
    }

    // Code is valid! Mark user as verified and automatically approve them
    const user = await prisma.user.update({
      where: { email },
      data: { 
        isEmailVerified: true,
        customerStatus: 'APPROVED'
      }
    });

    // Delete the OTP code
    await prisma.otpCode.deleteMany({
      where: { email }
    });

    // Send admin notification about new customer
    await prisma.notification.create({
      data: {
        type: 'NEW_CUSTOMER',
        title: 'عميل جديد',
        message: `قام ${user.name} (${user.email}) بتأكيد حسابه`,
        link: '/admin/customers',
      },
    }).catch(() => {}); // ignore error

    // Log the user in by generating a JWT session
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      customerStatus: user.customerStatus,
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(key);

    const cookieStore = await cookies();
    cookieStore.set('customer_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully. Logging in...',
      user: { id: user.id, name: user.name, email: user.email },
    }, { status: 200 });

  } catch (error: any) {
    console.error('OTP Verification error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error?.message || error) }, { status: 500 });
  }
}
