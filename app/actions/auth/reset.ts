"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendPasswordResetEmail } from "@/lib/mail";

function generateRandomPassword(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function resetPassword(email: string) {
  try {
    if (!email) {
      return { success: false, message: "يرجى إدخال البريد الإلكتروني" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return a generic success message to prevent email enumeration
      return { success: true, message: "إذا كان البريد مسجلاً لدينا، ستصلك رسالة بكلمة المرور الجديدة" };
    }

    // Generate new password
    const newPassword = generateRandomPassword(8);
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update in DB
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Send Email
    const emailResult = await sendPasswordResetEmail(email, newPassword);
    
    if (!emailResult.success) {
      console.error("Failed to send email", emailResult.error);
      const err = emailResult.error as any;
      const errMessage = err?.message ? ` (${err.message})` : '';
      return { success: false, message: `حدث خطأ أثناء إرسال البريد الإلكتروني${errMessage}` };
    }

    return { success: true, message: "إذا كان البريد مسجلاً لدينا، ستصلك رسالة بكلمة المرور الجديدة" };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { success: false, message: "حدث خطأ غير متوقع" };
  }
}
