import { Hono } from "hono";
import { z } from "zod";
import { authService } from "../services/authService.js";
import { validate } from "../utils/validation.js";
import { success } from "../utils/http.js";

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * authRoutes wires registration and login handlers backed by authService.
 */
export const authRoutes = new Hono();

authRoutes.post("/register", async (c) => {
  const body = await c.req.json();
  const payload = validate(registerSchema, body);
  const result = await authService.register(payload);
  return c.json(success(result, "User registered"));
});

authRoutes.post("/login", async (c) => {
  const body = await c.req.json();
  const payload = validate(loginSchema, body);
  const result = await authService.login(payload);
  return c.json(success(result, "Authenticated"));
});
