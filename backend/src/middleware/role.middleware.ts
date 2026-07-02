import type { RequestHandler } from "express";
import { AppError } from "../utils/AppError.js";
import type { UserRole } from "../types/auth.js";

export const requireRole = (...allowedRoles: UserRole[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      next(new AppError("You are not logged in", 401));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError("You do not have permission to perform this action", 403));
      return;
    }

    next();
  };
};

export const teacherOnly = requireRole("teacher");

export const studentOnly = requireRole("student");