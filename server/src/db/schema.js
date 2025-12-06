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
    theme TEXT NOT NULL DEFAULT 'light',
    netlify_site_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
];

// Migration statements to add new columns to existing tables
const migrationStatements = [
  // Add netlify_site_url column if it doesn't exist
  `DO $$ 
   BEGIN 
     IF NOT EXISTS (
       SELECT 1 FROM information_schema.columns 
       WHERE table_name = 'repo' AND column_name = 'netlify_site_url'
     ) THEN 
       ALTER TABLE repo ADD COLUMN netlify_site_url TEXT;
     END IF;
   END $$`,
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

  // Run migrations for existing tables
  for (const migration of migrationStatements) {
    await db.query(migration);
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
