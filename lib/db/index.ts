import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

declare global {
  // eslint-disable-next-line no-var
  var __postgresClient: ReturnType<typeof postgres> | undefined;
  // eslint-disable-next-line no-var
  var __postgresVersion: number | undefined;
}

// Version stamp: bump this if you need to force-reset the singleton (e.g. after config changes)
const CLIENT_VERSION = 2;

function createClient() {
  return postgres(connectionString, {
    prepare: false,       // required for transaction-mode poolers (Supabase port 6543)
    max: 20,              // increased to 20 for concurrent React Server Components and fast refreshes
    idle_timeout: 20,     // close idle connections after 20s
    connect_timeout: 15,  // 15s TCP connect timeout
    max_lifetime: 1800,   // recycle connections every 30 min to avoid stale state
    onnotice: () => {},   // suppress Supabase system notices
  });
}

// In dev: reuse singleton to survive hot reloads, but recreate if the version changed.
// In prod: always create a fresh client (module cache handles deduplication).
let client: ReturnType<typeof postgres>;

if (process.env.NODE_ENV === "production") {
  client = createClient();
} else {
  if (!globalThis.__postgresClient || globalThis.__postgresVersion !== CLIENT_VERSION) {
    // End any existing stale client before replacing it
    if (globalThis.__postgresClient) {
      globalThis.__postgresClient.end({ timeout: 1 }).catch(() => {});
    }
    globalThis.__postgresClient = createClient();
    globalThis.__postgresVersion = CLIENT_VERSION;

    // Fire-and-forget warm-up ping to pre-establish the connection pool
    // so the first OAuth callback (DrizzleAdapter upserts) doesn't hit a cold connection.
    globalThis.__postgresClient`SELECT 1`.catch(() => {});
  }
  client = globalThis.__postgresClient;
}

export const db = drizzle(client, { schema });
