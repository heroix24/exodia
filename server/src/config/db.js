import { Pool } from "pg";
import { env, featureFlags } from "../env.js";

let pool;

if (featureFlags.database) {
  pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: env.NODE_ENV === "production" ? 20 : 5,
    idleTimeoutMillis: 30_000,
  });

  pool.on("error", (err) => {
    console.error("[db] Unexpected error on idle client", err);
  });
}

export const db = {
  async query(text, params = []) {
    if (!pool) {
      throw new Error(
        "DATABASE_URL is not configured. Set it to enable persistence."
      );
    }

    return pool.query(text, params);
  },
  async getClient() {
    if (!pool) {
      throw new Error(
        "DATABASE_URL is not configured. Set it to enable persistence."
      );
    }

    return pool.connect();
  },
};

export const hasDatabase = featureFlags.database;
