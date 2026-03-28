import nodemailer from "nodemailer";

const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendSignupOtpEmail = async (
  email: string,
  name: string,
  otp: string,
): Promise<void> => {
  await getTransporter().sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Happora signup verification OTP",
    text: `Hello ${name}, your Happora verification OTP is ${otp}. It expires in 5 minutes.`,
    html: `<p>Hello ${name},</p><p>Your Happora verification OTP is <strong>${otp}</strong>.</p><p>This OTP expires in 5 minutes.</p>`,
  });
};
