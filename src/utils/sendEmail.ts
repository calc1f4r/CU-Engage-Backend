import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "irwin37@ethereal.email",
      pass: "Fq1ZS3QNyP5qM42KWM",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: {
      name: "Cu Engage",
      address: "support@cuengage",
    }, // sender address
    to: to, // receiver
    subject: "Password Reset Token", // Subject line
    text: `Hello, \n\nYou requested a password reset. Please visit the following link to reset your password: \n\n${resetUrl} \n\nIf you did not request this, please ignore this email.`, // plain text body
  });
}
