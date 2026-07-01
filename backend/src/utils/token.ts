import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { UserRole } from "../types/auth.js";

type TokenPayload = {
  userId: string;
  role: UserRole;
};

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
};