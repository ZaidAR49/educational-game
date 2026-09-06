import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getContactEmailTemplate, getUserConfirmationEmailTemplate } from '@/lib/emails/contact-template';

export async function POST(req: Request) {
  let isEn = false;
  try {
    const { name, email, subject, message, locale } = await req.json();
    isEn = locale === 'en';

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: isEn ? 'All required fields must be filled.' : 'جميع الحقول المطلوبة يجب أن تكون ممتلئة.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL, // Sending to the admin email
      replyTo: email,
      subject: `رسالة جديدة من الموقع: ${subject || 'بدون عنوان'}`,
      text: `
        الاسم: ${name}
        البريد الإلكتروني: ${email}
        الرسالة:
        ${message}
      `,
      html: getContactEmailTemplate({ name, email, subject, message }),
    };

    const userConfirmationMailOptions = {
      from: process.env.EMAIL,
      to: email, // Sending to the user
      subject: `استلمنا رسالتك - فريق الدعم`,
      html: getUserConfirmationEmailTemplate({ name }),
    };

    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(userConfirmationMailOptions)
    ]);

    return NextResponse.json({ success: true, message: isEn ? 'Message sent successfully' : 'تم إرسال الرسالة بنجاح' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: isEn ? 'An error occurred while sending your message. Please try again later.' : 'حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى لاحقاً.' },
      { status: 500 }
    );
  }
}
