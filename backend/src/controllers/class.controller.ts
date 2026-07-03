import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import {
  createClass,
  deleteClass,
  getClassById,
  getClasses,
  updateClass,
} from "../services/class.service.js";

const idSchema = z.string().uuid();

export const listClasses = asyncHandler(async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search : "";

  const subjectId =
    typeof req.query.subjectId === "string" ? req.query.subjectId : undefined;

  const teacherId =
    typeof req.query.teacherId === "string" ? req.query.teacherId : undefined;

  const status =
    typeof req.query.status === "string" ? req.query.status : undefined;

  const page =
    typeof req.query.page === "string" ? Number(req.query.page) || 1 : 1;

  const limit =
    typeof req.query.limit === "string" ? Number(req.query.limit) || 10 : 10;

  const result = await getClasses({
    search,
    subjectId,
    teacherId,
    status,
    page,
    limit,
  });

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const showClass = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Invalid class id", 400);
  }

  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    throw new AppError("Invalid class id", 400);
  }

  const classItem = await getClassById(parsedId.data);

  res.status(200).json({
    success: true,
    data: classItem,
  });
});

export const addClass = asyncHandler(async (req, res) => {
  const classItem = await createClass(req.body);

  res.status(201).json({
    success: true,
    data: classItem,
  });
});

export const editClass = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Invalid class id", 400);
  }

  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    throw new AppError("Invalid class id", 400);
  }

  const classItem = await updateClass(parsedId.data, req.body);

  res.status(200).json({
    success: true,
    data: classItem,
  });
});

export const removeClass = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Invalid class id", 400);
  }

  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    throw new AppError("Invalid class id", 400);
  }

  const classItem = await deleteClass(parsedId.data);

  res.status(200).json({
    success: true,
    data: classItem,
  });
});