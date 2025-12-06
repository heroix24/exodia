import { config as loadEnv } from "dotenv";
import path from "node:path";
import { z } from "zod";

loadEnv();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(8000),
  DATABASE_URL: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  GITHUB_PAT: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-5.1"),
  CLAUDE_API_KEY: z.string().optional(),
  CLAUDE_MODEL: z.string().default("claude-3-5-sonnet-20241022"),
  UPLOAD_DIR: z.string().optional(),
});

const parsed = envSchema.safeParse({
  ...process.env,
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"),
});

if (!parsed.success) {
  console.error(
    "[env] Missing or invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw parsed.error;
}

const resolvedUploadDir = path.isAbsolute(parsed.data.UPLOAD_DIR)
  ? parsed.data.UPLOAD_DIR
  : path.resolve(process.cwd(), parsed.data.UPLOAD_DIR);

export const env = {
  ...parsed.data,
  UPLOAD_DIR: resolvedUploadDir,
};

export const featureFlags = {
  database: Boolean(env.DATABASE_URL),
  github: Boolean(env.GITHUB_PAT),
  openai: Boolean(env.OPENAI_API_KEY),
  claude: Boolean(env.CLAUDE_API_KEY),
};

featureFlags.aiGeneration = featureFlags.openai || featureFlags.claude;
