import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

import { NODE_ENV } from "@types";

const EnvSchema = Type.Object({
  BASE_URL: Type.String(),
  GOOGLE_CLIENT_ID: Type.String(),
  GOOGLE_CLIENT_SECRET: Type.String(),
  NODE_ENV: Type.Enum(NODE_ENV),
  POSTGRES_URL: Type.String(),
  PORT: Type.String(),
});

if (!Value.Check(EnvSchema, process.env))
  throw new Error("Set your environment variables properly");

export const config = {
  //env variables
  ...Value.Cast(EnvSchema, process.env),
};
