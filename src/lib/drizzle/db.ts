import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/lib/drizzle/schema";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const db: NodePgDatabase<typeof schema> = drizzle(pool, {
  schema,
});

export default db;
