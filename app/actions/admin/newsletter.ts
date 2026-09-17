"use server";

import { PrismaClient } from '@prisma/client';
import basePrisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth';
import { checkActionPermission } from '@/lib/permissions';

function getDb(): PrismaClient {
  if ((basePrisma as any).newsletterSubscriber) {
    return basePrisma;
  }
  return new PrismaClient();
}

// Helper to check admin auth
async function checkAuth() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('غير مصرح لك بالقيام بهذا الإجراء');
  }
  return session;
}

export async function getNewsletterSubscribers(search?: string) {
  await checkAuth();
  await checkActionPermission('newsletter.view');
  const db = getDb();

  const whereClause: any = {};
  if (search && search.trim()) {
    whereClause.email = {
      contains: search.trim().toLowerCase(),
    };
  }

  const subscribers = await db.newsletterSubscriber.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  const totalCount = await db.newsletterSubscriber.count();
  const activeCount = await db.newsletterSubscriber.count({ where: { isActive: true } });

  return {
    subscribers,
    totalCount,
    activeCount,
  };
}

export async function deleteNewsletterSubscriber(id: string) {
  await checkAuth();
  await checkActionPermission('newsletter.delete');
  const db = getDb();

  await db.newsletterSubscriber.delete({
    where: { id },
  });

  revalidatePath('/[locale]/admin/newsletter', 'page');
  return { success: true };
}

export async function deleteMultipleNewsletterSubscribers(ids: string[]) {
  await checkAuth();
  await checkActionPermission('newsletter.delete');
  const db = getDb();

  if (!ids || ids.length === 0) {
    return { success: false, error: 'لم يتم تحديد أي مشتركين' };
  }

  await db.newsletterSubscriber.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  revalidatePath('/[locale]/admin/newsletter', 'page');
  return { success: true, count: ids.length };
}

interface SendEmailParams {
  subject: string;
  content: string;
  recipientType: 'all' | 'selected';
  selectedIds?: string[];
}

export async function sendNewsletterEmail({
  subject,
  content,
  recipientType,
  selectedIds = [],
}: SendEmailParams) {
  await checkAuth();
  await checkActionPermission('newsletter.send');
  const db = getDb();

  if (!subject.trim()) {
    return { success: false, error: 'عنوان الرسالة مطلوب' };
  }
  if (!content.trim()) {
    return { success: false, error: 'محتوى الرسالة مطلوب' };
  }

  let subscribers: { email: string }[] = [];

  if (recipientType === 'selected') {
    if (!selectedIds || selectedIds.length === 0) {
      return { success: false, error: 'يرجى تحديد المشتركين المطلوب إرسال الرسالة إليهم' };
    }
    subscribers = await db.newsletterSubscriber.findMany({
      where: {
        id: { in: selectedIds },
        isActive: true,
      },
      select: { email: true },
    });
  } else {
    subscribers = await db.newsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true },
    });
  }

  if (subscribers.length === 0) {
    return { success: false, error: 'لا يوجد مشتركون مستهدفون للإرسال' };
  }

  const emails = subscribers.map((s) => s.email);

  // Fetch store settings for sender name/email & SMTP
  let storeName = 'متجرنا';
  let senderEmail = 'noreply@store.com';
  let smtpHost = process.env.SMTP_HOST || '';
  let smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  let smtpUser = process.env.SMTP_USER || '';
  let smtpPass = process.env.SMTP_PASS || '';

  try {
    const db = getDb();
    const settings = await db.setting.findMany();
    const settingsMap = Object.fromEntries(settings.map((s: any) => [s.key, s.value]));
    if (settingsMap['store_name']) storeName = settingsMap['store_name'];
    if (settingsMap['contact_email']) senderEmail = settingsMap['contact_email'];
    if (settingsMap['smtp_host']) smtpHost = settingsMap['smtp_host'];
    if (settingsMap['smtp_port']) smtpPort = parseInt(settingsMap['smtp_port'], 10);
    if (settingsMap['smtp_user']) smtpUser = settingsMap['smtp_user'];
    if (settingsMap['smtp_pass']) smtpPass = settingsMap['smtp_pass'];
  } catch (e) {}

  // Construct styled HTML email template
  const formattedHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; direction: rtl; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
        .header { background: #0f172a; padding: 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: bold; }
        .content { padding: 32px 24px; line-height: 1.7; font-size: 15px; color: #334155; white-space: pre-line; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .footer p { margin: 4px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${storeName}</h1>
        </div>
        <div class="content">
          ${content.replace(/\n/g, '<br/>')}
        </div>
        <div class="footer">
          <p>أنت تتلقى هذه الرسالة لأنك مشترك في النشرة البريدية لـ ${storeName}.</p>
          <p>&copy; ${new Date().getFullYear()} ${storeName}. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // If SMTP credentials exist, send real emails
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Send to BCC to protect subscriber privacy
      await transporter.sendMail({
        from: `"${storeName}" <${senderEmail}>`,
        bcc: emails,
        subject: subject,
        text: content,
        html: formattedHtml,
      });

      return {
        success: true,
        sentCount: emails.length,
        message: `تم إرسال الرسالة بنجاح إلى ${emails.length} مشترك!`,
      };
    } catch (sendErr: any) {
      console.error('SMTP Send Error:', sendErr);
      return {
        success: false,
        error: `تعذر إرسال البريد عبر الخادم: ${sendErr.message || 'خطأ في إعدادات SMTP'}`,
      };
    }
  } else {
    // If SMTP is not yet configured, log and simulate successful broadcast
    console.log(`[Newsletter Simulation] BroadCast to ${emails.length} recipients:`);
    console.log(`Subject: ${subject}`);
    console.log(`Recipients:`, emails);

    return {
      success: true,
      simulated: true,
      sentCount: emails.length,
      message: `تمت معالجة الإرسال لـ ${emails.length} مشترك بنجاح! (ملاحظة: يمكنك ضبط بيانات خادم SMTP في الإعدادات لتفعيل الإرسال الفعلي)`,
    };
  }
}
