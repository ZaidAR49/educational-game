import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Singleton pattern: reuse the same client across hot reloads in dev.
// Without this, Next.js hot reload creates a new pool on every module
// reload, quickly exhausting the Supabase pooler's connection limit.
declare global {
  // eslint-disable-next-line no-var
  var __postgresClient: ReturnType<typeof postgres> | undefined;
}

const client =
  globalThis.__postgresClient ??
  postgres(connectionString, {
    prepare: false, // required for transaction-mode poolers (Supabase port 6543)
    max: 1,         // let the Supabase pooler manage the real pool size
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__postgresClient = client;
}

export const db = drizzle(client, { schema });
