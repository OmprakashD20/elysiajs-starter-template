import Elysia, { NotFoundError, t } from "elysia";
import { password as BunPassword } from "bun";
import { isWithinExpirationDate } from "oslo";

import { luciaSession } from "@auth";
import { config } from "@config";
import {
  createVerificationCode,
  deleteVerificationCode,
  getUserByEmail,
  getVerificationCode,
} from "@/lib/services";
import { AuthorizationError } from "@plugins/errors";
import VerifyEmailTemplate from "@templates/verify-email";
import { generateVerificationCode } from "@utils";
import { sendEmail } from "@utils/email";

const login = new Elysia().post(
  "/login",
  async ({ body, cookie, set }) => {
    const { email, password } = body;

    const user = await getUserByEmail(email);

    if (!user || !user.hashedPassword || !user.passwordSalt)
      throw new NotFoundError("User not found 😔");

    const isPasswordValid = await BunPassword.verify(
      user.passwordSalt + password + config.PASSWORD_PEPPER,
      user.hashedPassword
    );

    if (!isPasswordValid)
      throw new AuthorizationError("Invalid credentials 😔");

    if (!user.emailVerified) {
      const existingCode = await getVerificationCode(user.id);
      let hasExpired: boolean = true;
      if (existingCode)
        hasExpired = !isWithinExpirationDate(existingCode.expiresAt);

      if (hasExpired) {
        await deleteVerificationCode(user.id);
        const { expirationDate, verificationCode } = generateVerificationCode();

        await sendEmail({
          email,
          subject: "Email Verification",
          template: VerifyEmailTemplate(user.name, verificationCode),
        });

        await createVerificationCode({
          code: verificationCode,
          userId: user.id,
          email,
          expiresAt: expirationDate,
        });
      } else {
        await sendEmail({
          email,
          subject: "Email Verification",
          template: VerifyEmailTemplate(user.name, existingCode?.code!),
        });
      }
    }

    const session = await luciaSession.create(user.id);
    const sessionCookie = luciaSession.createCookie(session.id);

    set.status = 200;

    cookie[sessionCookie.name].set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });

    return {
      user: user.emailVerified && user,
      message: !user.emailVerified
        ? "Verification code has been sent to your email 🎉"
        : "You have successfully logged in 🎉",
      success: true,
    };
  },
  {
    body: t.Object({
      email: t.String({
        format: "email",
        error: "Invalid email address",
      }),
      password: t.String({
        minLength: 1,
        error: "Password is required",
      }),
    }),
  }
);

export default login;
