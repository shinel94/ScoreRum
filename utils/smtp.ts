import nodemailer from "nodemailer";
import { SmtpMailOption } from "../definition/primary";

const transporter = nodemailer.createTransport({
  service: "Naver",
  port: 587,
  host: "smtp.naver.com",
  auth: {
    user: process.env.SMTP_USER_ID,
    pass: process.env.SMTP_PWD,
  },
  requireTLS: true,
});

export const sendMail = (email: string, subject: string, content: string) => {
  const mailOptions: SmtpMailOption = {
    from: process.env.SMTP_USER_ID ? process.env.SMTP_USER_ID : "score-rum",
    to: email,
    subject: subject,
    html: content,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.info("Email sent: " + info.response);
    }
  });
};
