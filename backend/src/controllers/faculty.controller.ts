import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import {
  getFaculty,
  getFacultyMemberById,
} from "../services/faculty.service.js";

const idSchema = z.string().uuid();

export const listFaculty = asyncHandler(async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search : "";

  const page =
    typeof req.query.page === "string" ? Number(req.query.page) || 1 : 1;

  const limit =
    typeof req.query.limit === "string" ? Number(req.query.limit) || 10 : 10;

  const result = await getFaculty({
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

export const showFacultyMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Invalid faculty member id", 400);
  }

  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    throw new AppError("Invalid faculty member id", 400);
  }

  const facultyMember = await getFacultyMemberById(parsedId.data);

  res.status(200).json({
    success: true,
    data: facultyMember,
  });
});