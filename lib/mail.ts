import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function sendPasswordResetEmail(to: string, newPassword: string) {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'E-Commerce Store';
  const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    const { data, error } = await resend.emails.send({
      from: `${storeName} <${senderEmail}>`,
      to,
      subject: 'Your New Password - كلمة السر الجديدة',
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">إعادة ضبط كلمة المرور</h2>
          <p>مرحباً،</p>
          <p>لقد طلبت إعادة ضبط كلمة المرور الخاصة بحسابك. إليك كلمة السر الجديدة:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; letter-spacing: 2px;">
            ${newPassword}
          </div>
          <p>يُرجى تسجيل الدخول باستخدام هذه الكلمة، ثم تغييرها من إعدادات حسابك لأسباب أمنية.</p>
          <p>إذا لم تكن أنت من طلب هذا التغيير، يُرجى تجاهل هذه الرسالة.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">هذه الرسالة تم توليدها آلياً، يرجى عدم الرد عليها.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending reset password email via Resend:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send reset password email:', error);
    return { success: false, error };
  }
}
