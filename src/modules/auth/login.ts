import Elysia, { InternalServerError, NotFoundError, t } from "elysia";
import { password as BunPassword } from "bun";
import { isWithinExpirationDate } from "oslo";

import { config } from "@config";
import { luciaSession } from "@auth";
import {
  createVerificationCode,
  deleteVerificationCode,
  getUserByEmail,
  getVerificationCode,
} from "@/lib/services";
import { AuthorizationError } from "@plugins/errors";
import { generateVerificationCode } from "@utils";
import { sendEmail } from "@utils/email";

const login = new Elysia().post(
  "/login",
  async ({ body, cookie, set }) => {
    const { email, password } = body;

    const user = await getUserByEmail(email);

    if (!user || !user.hashedPassword || !user.passwordSalt)
      throw new NotFoundError("User not found");

    const isPasswordValid = await BunPassword.verify(
      user.passwordSalt + password + config.PASSWORD_PEPPER,
      user.hashedPassword
    );

    if (!isPasswordValid) throw new AuthorizationError("Invalid credentials");

    if (!user.emailVerified) {
      const { expirationDate, verificationCode } = generateVerificationCode();

      const emailResponse = await sendEmail({
        name: user.name,
        code: verificationCode,
        email,
      });

      if (!emailResponse) throw new InternalServerError();

      const existingCode = await getVerificationCode(user.id);

      if (existingCode) {
        const hasExpired = !isWithinExpirationDate(existingCode.expiresAt);

        if (hasExpired) await deleteVerificationCode(user.id);
      }

      await createVerificationCode({
        code: verificationCode,
        userId: user.id,
        email,
        expiresAt: expirationDate,
      });
    }

    const session = await luciaSession.create(user.id);
    const sessionCookie = luciaSession.createCookie(session.id);

    set.status = 200;

    cookie[sessionCookie.name].set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });

    return {
      user,
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
