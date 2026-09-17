"use server";

import prisma from '@/lib/prisma';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'الموضوع مطلوب'),
  message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل'),
});

export async function submitContactMessage(data: z.infer<typeof contactSchema>) {
  try {
    const validatedData = contactSchema.parse(data);
    
    await prisma.contactMessage.create({
      data: validatedData
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'NEW_MESSAGE',
        title: 'رسالة جديدة من اتصل بنا',
        message: `وصلت رسالة جديدة من ${validatedData.name} بخصوص: ${validatedData.subject}`,
        link: '/admin/messages',
      }
    }).catch(() => {});

    return { success: true };
  } catch (error: any) {
    if (error.errors) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'حدث خطأ أثناء إرسال الرسالة' };
  }
}
