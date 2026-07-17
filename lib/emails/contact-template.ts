import uiContent from '@/data/ui-content-general.json';

export interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function getContactEmailTemplate({ name, email, subject, message }: ContactEmailProps) {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>رسالة تواصل جديدة</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px; color: #111827;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
    
    <!-- Header -->
    <tr>
      <td style="background-color: #059669; padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.025em;">رسالة تواصل جديدة</h1>
        <p style="color: #a7f3d0; margin: 8px 0 0 0; font-size: 15px;">لديك استفسار جديد من نموذج الاتصال</p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 40px 32px;">
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
          <tr>
            <td width="50%" valign="top">
              <p style="margin: 0 0 6px 0; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">الاسم الكامل</p>
              <p style="margin: 0; font-size: 16px; font-weight: 700; color: #111827;">${name}</p>
            </td>
            <td width="50%" valign="top">
              <p style="margin: 0 0 6px 0; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">البريد الإلكتروني</p>
              <p style="margin: 0; font-size: 16px;">
                <a href="mailto:${email}" style="color: #059669; text-decoration: none; font-weight: 700;">${email}</a>
              </p>
            </td>
          </tr>
        </table>

        <div style="margin-bottom: 32px;">
          <p style="margin: 0 0 6px 0; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">الموضوع</p>
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #111827;">${subject || 'بدون عنوان'}</p>
        </div>

        <hr style="border: 0; border-top: 2px dashed #e5e7eb; margin: 32px 0;">

        <div>
          <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">محتوى الرسالة</p>
          <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 12px; padding: 24px; font-size: 16px; line-height: 1.8; color: #374151; white-space: pre-wrap;">${message}</div>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f3f4f6; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #9ca3af; font-size: 14px;">تم إرسال هذه الرسالة من نظام التواصل الخاص بمنصة ${uiContent.app.name}.</p>
        <p style="margin: 6px 0 0 0; color: #9ca3af; font-size: 14px;">يمكنك الرد مباشرة على هذا البريد للتواصل مع المُرسل.</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function getUserConfirmationEmailTemplate({ name }: { name: string }) {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>تم استلام رسالتك</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px; color: #111827;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
    
    <!-- Header -->
    <tr>
      <td style="background-color: #059669; padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.025em;">مرحباً ${name} 👋</h1>
        <p style="color: #a7f3d0; margin: 8px 0 0 0; font-size: 15px;">لقد استلمنا رسالتك بنجاح</p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 40px 32px; text-align: center;">
        <div style="margin-bottom: 24px;">
          <p style="margin: 0; font-size: 18px; line-height: 1.8; color: #374151;">
            شكراً لتواصلك معنا. نحن نقدر اهتمامك.<br><br>
            يقوم فريق الدعم الفني لدينا بمراجعة استفسارك حالياً، وسنقوم بالرد عليك في أقرب وقت ممكن.
          </p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        
        <p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
          مع أطيب التحيات،<br>
          <strong>فريق الدعم الفني لـ ${uiContent.app.name}</strong>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
