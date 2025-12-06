import jwt from "jsonwebtoken";
import { env } from "../env.js";

export const requireAuth = async (c, next) => {
  const header = c.req.header("Authorization");

  if (!header || !header.startsWith("Bearer ")) {
    return c.json(
      { status: "error", message: "Missing Authorization header" },
      401
    );
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    c.set("user", payload);
  } catch (error) {
    return c.json(
      { status: "error", message: "Invalid or expired token" },
      401
    );
  }

  await next();
};
