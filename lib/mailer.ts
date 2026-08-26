import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Assuming Gmail based on user prompt
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmailOtp(toEmail: string, otpCode: string) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("GMAIL_USER or GMAIL_APP_PASSWORD is not set. Simulating email by logging OTP to console:");
    console.log(`[TESTING] OTP for ${toEmail} is: ${otpCode}`);
    return true; // Return true to allow development/testing
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #c1291A; text-align: center;">Honda Showroom Authentication</h2>
      <p style="font-size: 16px; color: #333;">Hello,</p>
      <p style="font-size: 16px; color: #333;">Your One-Time Password (OTP) for authentication is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; background-color: #f3ebdd; padding: 15px 30px; border-radius: 8px; letter-spacing: 5px; color: #171717;">
          ${otpCode}
        </span>
      </div>
      <p style="font-size: 14px; color: #666; text-align: center;">
        This code is valid for 5 minutes. Please do not share it with anyone.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #999; text-align: center;">
        If you did not request this OTP, you can safely ignore this email.
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Honda Showroom Security" <noreply@hondashowroom.com>`, // Use an authenticated domain name
      replyTo: `"Honda Support" <support@hondashowroom.com>`,
      to: toEmail,
      subject: "Your Authentication OTP - Honda Showroom",
      html: htmlContent,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        // IMPORTANT: To completely stop emails from going to spam, configure SPF, DKIM, and DMARC records on your domain host.
      }
    });
    console.log("Email OTP sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending Email OTP: ", error);
    return false;
  }
}

export async function sendAdminAlert(subject: string, message: string, link?: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("ADMIN_EMAIL, GMAIL_USER or GMAIL_APP_PASSWORD is not set. Simulating admin alert:");
    console.log(`[TESTING ALERT] Subject: ${subject} | Message: ${message}`);
    return true;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #c1291A;">Admin Alert: ${subject}</h2>
      <p style="font-size: 16px; color: #333;">${message}</p>
      ${link ? `
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${link}" style="background-color: #c1291A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          View in Dashboard
        </a>
      </div>
      ` : ''}
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #999;">
        This is an automated notification from your Honda Showroom CMS.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Honda Showroom Alerts" <noreply@hondashowroom.com>`,
      to: adminEmail,
      subject: `Admin Alert: ${subject}`,
      html: htmlContent,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
      }
    });
    return true;
  } catch (error) {
    console.error("Error sending Admin Alert: ", error);
    return false;
  }
}
