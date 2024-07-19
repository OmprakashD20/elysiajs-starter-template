import nodemailer from "nodemailer";

import { config } from "@config";

export const sendEmail = async ({
  name,
  code,
  email,
}: {
  name: string;
  code: string;
  email: string;
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
      subject: "Email Verification",
      html: `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
          <tr>
              <td align="center" style="padding: 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                      <tr>
                          <td style="text-align: center; padding: 20px 0;">
                              <h1 style="font-size: 28px; color: #00466a; margin-bottom: 20px;">Email Verification</h1>
                          </td>
                      </tr>
                      <tr>
                          <td style="padding: 20px;">
                              <p style="font-size: 16px;">Welcome, <strong>${name}</strong>,</p>
                              <p style="font-size: 16px;">
                                You've successfully registered in ElysiaJS Starter Template. Please, enter the below code to verify your email.
                              </p>
                              <div style="text-align: center; margin-top: 20px;">
                                 <div style="text-decoration: none; display: inline-block; background-color: #00466a; color: #fff; font-size: 18px; padding: 10px 20px; border-radius: 5px;">${code}</div>
                              </div>
                              <p style="font-size: 16px; margin-top: 20px;">If you didn't request this, you can safely ignore this email. Reach out to us.</p>
                              <p style="font-size: 16px;">Regards,<br>Admin</p>
                          </td>
                      </tr>
                      <tr>
                          <td style="background-color: #eee; padding: 10px 20px; text-align: center; font-size: 14px;">
                              This email was sent from  ElysiaJS Starter Template &copy; 2024
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </div>`,
    };
  };

  return transporter.sendMail(options());
};
