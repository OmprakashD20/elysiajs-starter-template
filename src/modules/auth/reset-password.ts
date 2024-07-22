import Elysia, { NotFoundError, t } from "elysia";
import { password as BunPassword } from "bun";
import { isWithinExpirationDate } from "oslo";

import { luciaSession } from "@auth";
import { config } from "@config";
import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetToken,
  getUserByEmail,
  updateUser,
} from "@/lib/services";
import { encode, generatePasswordSalt, generateResetToken } from "@utils";
import { sendEmail } from "@utils/email";
import { BadRequestError } from "@plugins/errors";
import PasswordResetTemplate from "@templates/reset-password";

const resetPassword = new Elysia().group("/reset-password", (group) =>
  group
    .post(
      "/",
      async ({ body }) => {
        const { email } = body;

        const user = await getUserByEmail(email);

        if (!user) throw new NotFoundError("User not found 😔");

        const { expirationDate, resetToken, hashedResetToken } =
          await generateResetToken();

        await deletePasswordResetToken(user.id);

        await sendEmail({
          email,
          subject: "Password Reset Link",
          template: PasswordResetTemplate(user.name, resetToken),
        });

        await createPasswordResetToken({
          expiresAt: expirationDate,
          hashedToken: hashedResetToken,
          userId: user.id,
        });

        return {
          message: "Password reset link has been sent to your email 🎉",
          success: true,
        };
      },
      {
        body: t.Object({
          email: t.String({
            format: "email",
            error: "Invalid email address",
          }),
        }),
      }
    )
    .post(
      "/:token",
      async ({ body, params }) => {
        const { password } = body;
        const { token } = params;

        const hashedToken = await encode(token);

        const resetToken = await getPasswordResetToken(hashedToken);

        if (!resetToken) throw new BadRequestError("Invalid reset token 😔");

        await deletePasswordResetToken(resetToken.userId);

        if (!isWithinExpirationDate(resetToken.expiresAt))
          throw new BadRequestError("Reset token has expired 😔");

        await luciaSession.invalidateAll(resetToken.userId);

        const passwordSalt = generatePasswordSalt();
        const hashedPassword = await BunPassword.hash(
          passwordSalt + password + config.PASSWORD_PEPPER
        );

        await updateUser(resetToken.userId, {
          hashedPassword,
          passwordSalt,
        });

        return {
          message: "Your password has been updated successfully 🎉",
          success: true,
        };
      },
      {
        body: t.Object({
          password: t.String({
            minLength: 8,
            error: "Password must be at least 8 characters long",
          }),
        }),
        params: t.Object({
          token: t.String({
            error: "Invalid reset token",
          }),
        }),
      }
    )
);

export default resetPassword;
