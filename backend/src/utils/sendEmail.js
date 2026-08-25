import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const smtpUser = process.env.SMTP_MAIL || process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

    if (!to) {
      throw new Error("Recipient email 'to' address is required");
    }

    if (!smtpUser || !smtpPass) {
      console.warn("SMTP mail credentials are missing in environment variables. Skipping actual email send.");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${smtpUser}>`,
      to,
      subject,
      html,
    });

    console.log(`Email successfully sent to ${to}`);
  } catch (error) {
    console.error("Email sending error:", error.message || error);
    throw error;
  }
};