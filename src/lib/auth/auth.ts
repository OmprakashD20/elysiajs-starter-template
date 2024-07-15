import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import db from "@db";
import { SessionTable, UserTable } from "@/lib/drizzle/schema";

const adapter = new DrizzlePostgreSQLAdapter(db, SessionTable, UserTable);

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: true,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (user) => user,
});

export const luciaSession = {
  create: (userId: string) => lucia.createSession(userId, {}),
  delete: () => lucia.deleteExpiredSessions(),
  invalidate: (sessionId: string) => lucia.invalidateSession(sessionId),
  createCookie: (sessionId: string) => lucia.createSessionCookie(sessionId),
  createBlankCookie: () => lucia.createBlankSessionCookie(),
  validate: (sessionId: string) => lucia.validateSession(sessionId),
};

export default lucia;

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  name: string;
  email: string;
  image: string;
  currency: string;
}
