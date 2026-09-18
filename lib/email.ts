import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function sendOTP(email: string, code: string) {
  try {
    const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'E-Commerce Store';
    const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    const { data, error } = await resend.emails.send({
      from: `${storeName} <${senderEmail}>`,
      to: email,
      subject: 'رمز التحقق لتسجيل حسابك / Verification Code',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">مرحباً بك!</h2>
          <p>شكراً لتسجيلك معنا. رمز التحقق الخاص بك هو:</p>
          <div style="margin: 20px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e40af; text-align: center; padding: 15px; background: #f3f4f6; border-radius: 8px;">
            ${code}
          </div>
          <p>هذا الرمز صالح لمدة 10 دقائق فقط.</p>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p dir="ltr" style="font-size: 12px; color: #888;">
            If you did not request this code, please ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
}
