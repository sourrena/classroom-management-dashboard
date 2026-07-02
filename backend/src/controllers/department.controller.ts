import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import {
  createDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from "../services/department.service.js";

export const listDepartments = asyncHandler(async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search : "";

  const page =
    typeof req.query.page === "string" ? Number(req.query.page) || 1 : 1;

  const limit =
    typeof req.query.limit === "string" ? Number(req.query.limit) || 10 : 10;

  const result = await getDepartments({
    search,
    page,
    limit,
  });

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const showDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Invalid department id", 400);
  }

  const department = await getDepartmentById(id);

  res.status(200).json({
    success: true,
    data: department,
  });
});

export const addDepartment = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("You are not logged in", 401);
  }

  const department = await createDepartment(req.body, req.user.id);

  res.status(201).json({
    success: true,
    data: department,
  });
});

export const editDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Invalid department id", 400);
  }

  const department = await updateDepartment(id, req.body);

  res.status(200).json({
    success: true,
    data: department,
  });
});