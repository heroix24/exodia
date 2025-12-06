import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { env } from "./env.js";
import { ensureUploadRoots } from "./config/storage.js";
import { ensureDatabaseSchema } from "./db/schema.js";
import { errorHandler } from "./middleware/error.js";
import { authRoutes } from "./routes/auth.js";
import { uploadRoutes } from "./routes/uploads.js";
import { sheetRoutes } from "./routes/sheets.js";
import { repoRoutes } from "./routes/repos.js";
import { healthRoutes } from "./routes/health.js";
import { docsRoutes } from "./routes/docs.js";
import { log } from "./utils/logger.js";

await ensureUploadRoots();
await ensureDatabaseSchema();

const app = new Hono();

app.use("*", cors());
app.use("*", logger());

app.route("/health", healthRoutes);
app.route("/docs", docsRoutes);

const api = app.basePath("/api/v1");
api.route("/auth", authRoutes);
api.route("/uploads", uploadRoutes);
api.route("/sheets", sheetRoutes);
api.route("/repos", repoRoutes);

app.notFound((c) =>
  c.json({ status: "error", message: "Route not found" }, 404)
);
app.onError(errorHandler);

serve({
  fetch: app.fetch,
  port: env.PORT,
});

log.info(`Exodia server running on http://localhost:${env.PORT}`);
