import { db, hasDatabase } from "../config/db.js";
import { log } from "../utils/logger.js";

const ddlStatements = [
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
  `CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL,
    password_hashed TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS repo (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    excel_id UUID UNIQUE NOT NULL,
    github_repo_name TEXT NOT NULL,
    github_repo_url TEXT NOT NULL,
    github_branch TEXT NOT NULL DEFAULT 'main',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
];

const ensureTimestampsTrigger = `
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

const triggers = [
  `CREATE TRIGGER user_set_updated_at
    BEFORE UPDATE ON "user"
    FOR EACH ROW EXECUTE PROCEDURE set_updated_at()`,
  `CREATE TRIGGER repo_set_updated_at
    BEFORE UPDATE ON repo
    FOR EACH ROW EXECUTE PROCEDURE set_updated_at()`,
];

export const ensureDatabaseSchema = async () => {
  if (!hasDatabase) {
    log.warn("DATABASE_URL is not set; skipping schema migration");
    return;
  }

  for (const statement of ddlStatements) {
    await db.query(statement);
  }

  await db.query(ensureTimestampsTrigger);

  for (const trigger of triggers) {
    try {
      await db.query(trigger);
    } catch (error) {
      if (error.code !== "42710") {
        throw error;
      }
    }
  }

  log.info("Database schema verified.");
};
