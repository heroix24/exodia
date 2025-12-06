import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { db, hasDatabase } from "../config/db.js";
import { env } from "../env.js";

const memoryUsersByEmail = new Map();
const memoryUsersById = new Map();

const baseUserFields =
  'id, full_name AS "fullName", email, password_hashed AS "passwordHashed"';

const normalizeEmail = (email) => email.trim().toLowerCase();

const issueToken = (user) =>
  jwt.sign(
    { id: user.id, fullName: user.fullName, email: user.email },
    env.JWT_SECRET,
    { expiresIn: "12h" }
  );

const mapRow = (row) => ({
  id: row.id,
  fullName: row.fullName ?? row.full_name,
  email: row.email,
  passwordHashed: row.password_hashed ?? row.passwordHashed,
});

async function persistUser(user) {
  if (hasDatabase) {
    await db.query(
      'INSERT INTO "user" (id, full_name, password_hashed, email) VALUES ($1, $2, $3, $4)',
      [user.id, user.fullName, user.passwordHashed, user.email]
    );
  } else {
    memoryUsersByEmail.set(user.email, user);
    memoryUsersById.set(user.id, user);
  }
}

async function findUserByEmail(email) {
  const normalized = normalizeEmail(email);

  if (hasDatabase) {
    const result = await db.query(
      `SELECT ${baseUserFields} FROM "user" WHERE email = $1 LIMIT 1`,
      [normalized]
    );
    return result.rowCount ? mapRow(result.rows[0]) : null;
  }

  return memoryUsersByEmail.get(normalized) || null;
}

export const authService = {
  async register({ fullName, email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const existing = await findUserByEmail(normalizedEmail);

    if (existing) {
      const error = new Error("Email is already registered");
      error.status = 409;
      throw error;
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    const user = {
      id: randomUUID(),
      fullName,
      email: normalizedEmail,
      passwordHashed,
    };

    await persistUser(user);

    const token = issueToken(user);

    return {
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    };
  },

  async login({ email, password }) {
    const user = await findUserByEmail(email);

    if (!user) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      throw error;
    }

    const match = await bcrypt.compare(password, user.passwordHashed);

    if (!match) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      throw error;
    }

    const token = issueToken(user);

    return {
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    };
  },
};
