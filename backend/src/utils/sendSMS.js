import twilio from "twilio";

<<<<<<< HEAD
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async (phone, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      to: phone,                        // Must be in +91... format
      from: process.env.TWILIO_PHONE    // Your Twilio purchased number
    });

    console.log("OTP SMS sent:", message.sid);
    return message.sid;
  } catch (error) {
    console.error("Error sending OTP SMS:", error);
    throw error;
  }
=======
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export const sendSMS = async (phone, otp) => {
  await client.messages.create({
    body: `Your OTP is ${otp}`,
    to: phone,
    from: process.env.TWILIO_PHONE
  });
>>>>>>> 04d5531 (first)
};
