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
    console.warn("GMAIL_USER or GMAIL_APP_PASSWORD is not set. Email will not be sent.");
    return false;
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
      from: `"Honda Showroom" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Your Authentication OTP - Honda Showroom",
      html: htmlContent,
    });
    console.log("Email OTP sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending Email OTP: ", error);
    return false;
  }
}
