import Elysia, { InternalServerError, t } from "elysia";
import { password as BunPassword } from "bun";

import { luciaSession } from "@auth";
import { config } from "@config";
import db from "@db";
import { ClientError } from "@plugins/errors";
import {
  createUser,
  createVerificationCode,
  getUserByEmail,
} from "@/lib/services";
import { generatePasswordSalt, generateVerificationCode } from "@utils";
import { sendEmail } from "@utils/email";

const register = new Elysia().post(
  "/register",
  async ({ body, cookie, set }) => {
    const { email, name, password } = body;

    const existingUser = await getUserByEmail(email);
    if (existingUser)
      throw new ClientError("User already exists", 409, "CONFLICT");

    const passwordSalt = generatePasswordSalt();
    const hashedPassword = await BunPassword.hash(
      passwordSalt + password + config.PASSWORD_PEPPER
    );

    try {
      let userId;
      await db.transaction(async (txn) => {
        const result = await createUser(
          {
            email,
            name,
            hashedPassword,
            passwordSalt,
          },
          txn
        );

        userId = result.userId;

        const { expirationDate, verificationCode } = generateVerificationCode();

        const emailResponse = await sendEmail({
          name,
          code: verificationCode,
          email,
        });

        if (!emailResponse) throw new InternalServerError();

        await createVerificationCode(
          {
            code: verificationCode,
            userId,
            email,
            expiresAt: expirationDate,
          },
          txn
        );
      });

      const session = await luciaSession.create(userId!);
      const sessionCookie = luciaSession.createCookie(session.id);

      // Set the status code to 302 to redirect the user to the email verification page on client side
      // set.status = 302;

      set.status = 201;

      cookie[sessionCookie.name].set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });

      return {
        userId,
        message: "Verification code has been sent to your email 🎉",
        success: true,
      };
    } catch (error: any) {
      throw new InternalServerError("Failed to register user 😔");
    }
  },
  {
    body: t.Object({
      email: t.String({
        format: "email",
        error: "Invalid email address",
      }),
      password: t.String({
        minLength: 8,
        error: "Password must be at least 8 characters long",
      }),
      name: t.String({
        minLength: 3,
        maxLength: 40,
        error: "Name must be between 3 and 40 characters long",
      }),
    }),
  }
);

export default register;
