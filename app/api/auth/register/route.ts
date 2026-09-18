import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations/auth';
import { sendOTP } from '@/lib/email';

// Generate a 6 digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return NextResponse.json(
          { error: 'An account with this email already exists and is verified.' },
          { status: 409 }
        );
      }
      
      // User exists but not verified. Update password just in case they typed a new one.
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          name: validatedData.name,
          phone: validatedData.phone || null,
        }
      });
    } else {
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);

      await prisma.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          password: hashedPassword,
          role: 'CUSTOMER',
          customerStatus: 'PENDING',
          status: true,
          isEmailVerified: false,
        },
      });
    }

    // Generate and save OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any old OTPs for this email to prevent spam
    await prisma.otpCode.deleteMany({
      where: { email: validatedData.email }
    });

    await prisma.otpCode.create({
      data: {
        email: validatedData.email,
        code,
        expiresAt,
      }
    });

    // Send OTP email via Resend
    const sent = await sendOTP(validatedData.email, code);
    
    if (!sent) {
       console.error("Failed to send OTP to:", validatedData.email);
       // We still return success but maybe warn in logs
    }

    // Return requiresVerification instead of final success
    return NextResponse.json({
      success: true,
      requiresVerification: true,
      email: validatedData.email,
      message: 'OTP sent successfully. Please check your email.',
    }, { status: 200 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error?.message || error) }, { status: 500 });
  }
}
