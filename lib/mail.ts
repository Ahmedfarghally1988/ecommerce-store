import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(to: string, newPassword: string) {
  const mailOptions = {
    from: `"Store Admin" <${process.env.SMTP_USER}>`,
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
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
