import Elysia, { NotFoundError, t } from "elysia";
import { password as BunPassword } from "bun";

import { config } from "@config";
import { luciaSession } from "@/lib/auth/auth";
import {
  AuthorizationError,
} from "@plugins/errors";
import { getUserByEmail } from "@/lib/services";

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

    const session = await luciaSession.create(user.id);
    const sessionCookie = luciaSession.createCookie(session.id);

    set.status = 200;

    cookie[sessionCookie.name]?.set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });

    return {
      user,
      message: "You have successfully logged in",
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
