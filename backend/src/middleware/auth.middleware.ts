import type { RequestHandler } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../utils/token.js";
import type { UserRole } from "../types/auth.js";

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("You are not logged in", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new AppError("Invalid authorization token", 401);
}

const decoded = verifyToken(token);

    const [user] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    req.user = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role as UserRole,
      avatarUrl: user.avatarUrl,
    };

    next();
  } catch (error) {
    next(error);
  }
};