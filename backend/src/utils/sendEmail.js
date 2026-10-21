import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const smtpUser = process.env.SMTP_MAIL || process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

    if (!to) {
      throw new Error("Recipient email 'to' address is required");
    }

    if (!smtpUser || !smtpPass) {
      console.warn("⚠️ SMTP mail credentials are missing in environment variables. Skipping actual email send.");
      return;
    }

    const cleanedUser = smtpUser.trim();
    const cleanedPass = smtpPass.replace(/\s+/g, "");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: cleanedUser,
        pass: cleanedPass,
      },
    });

    const plainText = typeof html === "string" ? html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";

    await transporter.sendMail({
      from: `"PROPSESTATE" <${cleanedUser}>`,
      to: typeof to === "string" ? to.trim() : to,
      subject,
      text: plainText,
      html,
    });

    console.log(`✅ Email successfully sent to ${to}`);
  } catch (error) {
    console.error("❌ Email sending error:", error.message || error);
    throw error;
  }
};
