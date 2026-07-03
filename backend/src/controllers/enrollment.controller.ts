import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import {
  createEnrollment,
  deleteEnrollment,
  getEnrollments,
} from "../services/enrollment.service.js";

const idSchema = z.string().uuid();

const optionalUuidSchema = z.string().uuid();

export const listEnrollments = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("You are not logged in", 401);
  }

  const search = typeof req.query.search === "string" ? req.query.search : "";

  const classId =
    typeof req.query.classId === "string" ? req.query.classId : undefined;

  const studentId =
    typeof req.query.studentId === "string" ? req.query.studentId : undefined;

  if (classId && !optionalUuidSchema.safeParse(classId).success) {
    throw new AppError("Invalid class id", 400);
  }

  if (studentId && !optionalUuidSchema.safeParse(studentId).success) {
    throw new AppError("Invalid student id", 400);
  }

  const page =
    typeof req.query.page === "string" ? Number(req.query.page) || 1 : 1;

  const limit =
    typeof req.query.limit === "string" ? Number(req.query.limit) || 10 : 10;

  const result = await getEnrollments({
    currentUser: {
      id: req.user.id,
      role: req.user.role,
    },
    search,
    classId,
    studentId,
    page,
    limit,
  });

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const addEnrollment = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("You are not logged in", 401);
  }

  const enrollment = await createEnrollment(req.body, req.user.id);

  res.status(201).json({
    success: true,
    data: enrollment,
  });
});

export const removeEnrollment = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("You are not logged in", 401);
  }

  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Invalid enrollment id", 400);
  }

  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    throw new AppError("Invalid enrollment id", 400);
  }

  const enrollment = await deleteEnrollment(parsedId.data, {
    id: req.user.id,
    role: req.user.role,
  });

  res.status(200).json({
    success: true,
    data: enrollment,
  });
});