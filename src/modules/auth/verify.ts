import Elysia, { t } from "elysia";
import { User } from "lucia";
import { isWithinExpirationDate } from "oslo";

import { luciaSession } from "@auth";
import { AuthorizationError, BadRequestError } from "@plugins/errors";
import {
  deleteVerificationCode,
  getVerificationCode,
  updateUser,
} from "@/lib/services";

const verify = new Elysia().post(
  "/verify-email",
  // @ts-ignore
  async ({ body, cookie, set, user }) => {
    const { code } = body;

    if (!user)
      throw new AuthorizationError(
        "You must be logged in to verify your email 😔"
      );

    const isValidCode = await verifyCode(code, user);

    if (!isValidCode) throw new BadRequestError("Invalid verification code 😔");

    await luciaSession.invalidateAll(user.id);

    await updateUser(user.id, { emailVerified: true });

    const session = await luciaSession.create(user.id);
    const sessionCookie = luciaSession.createCookie(session.id);

    cookie[sessionCookie.name]?.set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });

    // Set the status code to 302 to redirect the user to the email verification page on client side and set the redirect URL to the dashboard
    // set.status = 302;
    // set.redirect = "/dashboard";

    set.status = 200;

    return {
      message: "Your email has been verified successfully 🎉",
      success: true,
    };
  },
  {
    body: t.Object({
      code: t.String({
        error: "Missing email verification code",
      }),
    }),
  }
);

async function verifyCode(code: string, user: User): Promise<boolean> {
  const verificationCode = await getVerificationCode(user.id);

  if (!verificationCode || verificationCode.code !== code) return false;

  await deleteVerificationCode(user.id);

  if (!isWithinExpirationDate(verificationCode.expiresAt)) return false;

  return true;
}

export default verify;
