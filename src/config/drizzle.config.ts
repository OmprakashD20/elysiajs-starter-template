import { defineConfig } from "drizzle-kit";

import { config } from "@config";

export default defineConfig({
  schema: "./src/lib/drizzle/schema.ts",
  out: "./src/lib/drizzle/migrations/",
  dialect: "postgresql",
  dbCredentials: {
    url: config.POSTGRES_URL,
  },
  verbose: true,
  strict: true,
});
