import { and, eq } from "drizzle-orm";

import db from "@db";
import { OAuthAccountTable, UserTable } from "@/lib/drizzle/schema";
import { OAuthAccount, User } from "@types";

type CreateUser = {
  email: string;
  name: string;
  hashedPassword?: string;
  passwordSalt?: string;
  emailVerified?: boolean;
  image?: string;
};

export async function getUserByEmail(
  email: string,
  txn = db
): Promise<User | undefined> {
  return await txn.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
  });
}

export async function createUser(
  user: CreateUser,
  txn = db
): Promise<{ userId: string }> {
  const [userId] = await txn
    .insert(UserTable)
    .values({ ...user })
    .returning({
      userId: UserTable.id,
    });
  return userId;
}

export async function getOAuthAccountByProvider(
  provider: string,
  providerUserId: string,
  txn = db
): Promise<OAuthAccount | undefined> {
  return await txn.query.OAuthAccountTable.findFirst({
    where: and(
      eq(OAuthAccountTable.provider, provider),
      eq(OAuthAccountTable.providerUserId, providerUserId)
    ),
  });
}

export async function createOAuthAccount(
  user: Omit<OAuthAccount, "id" | "createdAt" | "updatedAt">,
  txn = db
) {
  return await txn.insert(OAuthAccountTable).values({ ...user });
}
