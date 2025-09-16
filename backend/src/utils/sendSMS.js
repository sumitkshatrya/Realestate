import twilio from "twilio";

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export const sendSMS = async (phone, otp) => {
  await client.messages.create({
    body: `Your OTP is ${otp}`,
    to: phone,
    from: process.env.TWILIO_PHONE
  });
};
