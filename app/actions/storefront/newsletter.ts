"use server";

import { PrismaClient } from '@prisma/client';
import basePrisma from '@/lib/prisma';
import { z } from 'zod';

function getDb(): PrismaClient {
  if ((basePrisma as any).newsletterSubscriber) {
    return basePrisma;
  }
  return new PrismaClient();
}

const emailSchema = z.string().email('يرجى إدخال بريد إلكتروني صحيح');

export async function subscribeToNewsletter(email: string) {
  try {
    const trimmed = (email || '').trim().toLowerCase();
    const parsed = emailSchema.safeParse(trimmed);
    if (!parsed.success) {
      return {
        success: false,
        error: 'يرجى إدخال بريد إلكتروني صالح',
      };
    }

    const db = getDb();

    // Check if email already exists
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: trimmed },
    });

    if (existing) {
      return {
        success: false,
        error: 'هذا البريد الإلكتروني مسجل مسبقاً بالفعل في النشرة البريدية',
        alreadySubscribed: true,
      };
    }

    // Create new subscriber
    await db.newsletterSubscriber.create({
      data: {
        email: trimmed,
        isActive: true,
      },
    });

    return {
      success: true,
      message: 'تم الاشتراك بنجاح في النشرة البريدية! 🎉',
    };
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return {
      success: false,
      error: 'حدث خطأ أثناء الاشتراك، يرجى المحاولة مرة أخرى',
    };
  }
}
