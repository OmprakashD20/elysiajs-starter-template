import Elysia from "elysia";
import { type User, type Session, verifyRequestOrigin } from "lucia";

import { luciaSession } from "@auth";

export const AuthMiddleware = new Elysia().derive(
  { as: "scoped" },
  async ({
    cookie,
    request,
  }): Promise<{
    user: User | null;
    session: Session | null;
  }> => {
    if (request.method !== "GET") {
      const originHeader = request.headers.get("Origin");
      const hostHeader = request.headers.get("host");
      if (
        !originHeader ||
        !hostHeader ||
        !verifyRequestOrigin(originHeader, [hostHeader])
      ) {
        return {
          user: null,
          session: null,
        };
      }
    }

    const cookieHeader = request.headers.get("Cookie") ?? "";
    const sessionId = luciaSession.readSessionCookie(cookieHeader);
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const { session, user } = await luciaSession.validate(sessionId);
    if (session && session.fresh) {
      const sessionCookie = luciaSession.createCookie(session.id);
      cookie[sessionCookie.name]?.set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });
    }
    if (!session) {
      const sessionCookie = luciaSession.createBlankCookie();
      cookie[sessionCookie.name]?.set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });
    }
    return {
      user,
      session,
    };
  }
);
