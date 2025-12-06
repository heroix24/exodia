import { Hono } from "hono";

/**
 * healthRoutes returns a lightweight status payload used by external monitors.
 */
export const healthRoutes = new Hono();

healthRoutes.get("/", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() })
);
