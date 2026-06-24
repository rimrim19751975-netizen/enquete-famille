import { createClient } from "@libsql/client";
import { createTablesSQL } from "./schema";
import type { Client } from "@libsql/client";

function getConfig() {
  return {
    url: process.env.TURSO_DATABASE_URL ||
      process.env.LIBSQL_DATABASE_URL ||
      process.env.DATABASE_URL ||
      "",
    authToken: process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN,
  };
}

let _client: Client | null = null;

export function getClient(): Client {
  if (!_client) {
    const { url, authToken } = getConfig();
    if (!url) throw new Error("TURSO_DATABASE_URL is required");
    _client = createClient({ url, authToken });
  }
  return _client;
}

let initPromise: Promise<void> | null = null;

export function ensureDatabase() {
  initPromise ??= (async () => {
    const c = getClient();
    await c.executeMultiple(createTablesSQL);
  })();
  return initPromise;
}
