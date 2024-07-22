import { relations, sql } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const UserTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  hashedPassword: text("hashed_password"),
  passwordSalt: text("password_salt"),
  image: text("image").default("https://github.com/shadcn.png").notNull(),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const OAuthAccountTable = pgTable("oauth_accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  provider: text("provider").default("google"),
  providerUserId: text("provider_user_id").notNull(),
  accessToken: text("access_token").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const SessionTable = pgTable("sessions", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const EmailVerificationCodeTable = pgTable("email_verification_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  userId: text("user_id")
    .unique()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const PasswordResetTokenTable = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  hashedToken: text("hashed_token").notNull(),
  userId: text("user_id")
    .unique()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const UserTableRelations = relations(UserTable, ({ one, many }) => ({
  sessions: many(SessionTable),
  oauthAccounts: many(OAuthAccountTable),
  emailVerificationCode: one(EmailVerificationCodeTable, {
    fields: [UserTable.id],
    references: [EmailVerificationCodeTable.userId],
  }),
  passwordResetToken: one(PasswordResetTokenTable, {
    fields: [UserTable.id],
    references: [PasswordResetTokenTable.userId],
  }),
}));

export const OAuthAccountTableRelations = relations(
  OAuthAccountTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [OAuthAccountTable.userId],
      references: [UserTable.id],
    }),
  })
);

export const SessionTableRelations = relations(SessionTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [SessionTable.userId],
    references: [UserTable.id],
  }),
}));
