import nodemailer from "nodemailer";

export const sendResetPasswordEmail = (user, req) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const text = getMessageText(user, req);

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: user.email,
    subject: "Password Reset",
    text,
  };

  transporter.sendMail(message).then((info) => {
    console.log("Message sent: %s", info.messageId);
  });
};

const getMessageText = (user, req) => {
  const resetToken = user.getResetPasswordToken();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/auth/resetpassword/${resetToken}`;

  const text = `To reset password please make a PUT request to: \n\n ${resetUrl}`;

  return text;
};
