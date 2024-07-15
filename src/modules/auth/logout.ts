import Elysia from "elysia";

import lucia, { luciaSession } from "@auth";
import { AuthenticationError } from "@/plugins/errors";

const logout = new Elysia().post("/logout", async ({ cookie }) => {
  const sessionCookie = cookie[lucia.sessionCookieName];

  if (!sessionCookie?.value)
    throw new AuthenticationError(
      "Session not found. Please log in again to continue 😔"
    );

  await luciaSession.invalidate(sessionCookie.value);

  const blankSessionCookie = luciaSession.createBlankCookie();
  sessionCookie.set({
    value: blankSessionCookie.value,
    ...blankSessionCookie.attributes,
  });

  return {
    success: true,
    message: "Logged out successfully 🎉",
  };
});

export default logout;
