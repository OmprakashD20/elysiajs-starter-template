import nodemailer from "nodemailer";

import { config } from "@config";

export const sendEmail = async ({
  email,
  subject,
  template,
}: {
  email: string;
    subject: string;
    template: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    host: config.EMAIL_HOST,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD,
    },
    secure: true,
  });

  const options = () => {
    return {
      from: config.EMAIL_USER,
      to: email,
      subject,
      html: template,
    };
  };

  return transporter.sendMail(options());
};
