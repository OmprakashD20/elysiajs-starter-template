import Elysia, { InternalServerError, t } from "elysia";
import { password as BunPassword } from "bun";

import { config } from "@config";
import { luciaSession } from "@/lib/auth/auth";
import { ClientError } from "@plugins/errors";
import { createUser, getUserByEmail } from "@/lib/services";
import { generatePasswordSalt } from "@utils";

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
      const { userId } = await createUser({
        email,
        name,
        hashedPassword,
        passwordSalt,
      });

      const session = await luciaSession.create(userId);
      const sessionCookie = luciaSession.createCookie(session.id);

      set.status = 201;

      cookie[sessionCookie.name]?.set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });

      return { userId, message: "You have successfully registered!!" };
    } catch (error: any) {
      console.error(error);
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
