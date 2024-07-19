import { and, eq } from "drizzle-orm";

import db from "@db";
import {
  EmailVerificationCodeTable,
  OAuthAccountTable,
  UserTable,
} from "@/lib/drizzle/schema";
import { EmailVerificationCode, OAuthAccount, User } from "@types";
import { MakeOptional } from "@utils";

export async function getUserByEmail(
  email: string,
  txn = db
): Promise<User | undefined> {
  return await txn.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
  });
}

export async function createUser(
  user: MakeOptional<
    User,
    "emailVerified" | "hashedPassword" | "image" | "passwordSalt",
    "createdAt" | "id" | "updatedAt"
  >,
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

export async function updateUser(
  userId: string,
  data: Partial<User>,
  txn = db
) {
  await txn
    .update(UserTable)
    .set({ ...data })
    .where(eq(UserTable.id, userId));
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

export async function createVerificationCode(
  data: Omit<EmailVerificationCode, "id">,
  txn = db
) {
  return await txn.insert(EmailVerificationCodeTable).values({ ...data });
}

export async function getVerificationCode(
  userId: string,
  txn = db
): Promise<EmailVerificationCode | undefined> {
  return await txn.query.EmailVerificationCodeTable.findFirst({
    where: eq(EmailVerificationCodeTable.userId, userId),
  });
}

export async function deleteVerificationCode(userId: string, txn = db) {
  await txn
    .delete(EmailVerificationCodeTable)
    .where(eq(EmailVerificationCodeTable.userId, userId));
}
