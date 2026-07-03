import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import {
  createSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
} from "../services/subject.service.js";

export const listSubjects = asyncHandler(async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search : "";

  const departmentId =
    typeof req.query.departmentId === "string"
      ? req.query.departmentId
      : undefined;

  const page =
    typeof req.query.page === "string" ? Number(req.query.page) || 1 : 1;

  const limit =
    typeof req.query.limit === "string" ? Number(req.query.limit) || 10 : 10;

  const result = await getSubjects({
    search,
    departmentId,
    page,
    limit,
  });

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const showSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Invalid subject id", 400);
  }

  const subject = await getSubjectById(id);

  res.status(200).json({
    success: true,
    data: subject,
  });
});

export const addSubject = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("You are not logged in", 401);
  }

  const subject = await createSubject(req.body, req.user.id);

  res.status(201).json({
    success: true,
    data: subject,
  });
});

export const editSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Invalid subject id", 400);
  }

  const subject = await updateSubject(id, req.body);

  res.status(200).json({
    success: true,
    data: subject,
  });
});