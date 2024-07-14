import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";

import * as schema from "@/lib/drizzle/schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

type TSchema = ExtractTablesWithRelations<typeof schema>;
type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>;

export type InferResultType<
  TableName extends keyof TSchema,
  QBConfig extends QueryConfig<TableName> = {}
> = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;

export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}
