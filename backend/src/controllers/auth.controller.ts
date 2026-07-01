import { asyncHandler } from "../utils/asyncHandler.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { AppError } from "../utils/AppError.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("You are not logged in", 401);
  }

  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});