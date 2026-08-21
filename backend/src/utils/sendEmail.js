import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_MAIL}>`,
      to,
      subject,
      html,
    });

    console.log(`Email successfully sent to ${to}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};