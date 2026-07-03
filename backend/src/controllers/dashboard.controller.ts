import { asyncHandler } from "../utils/asyncHandler.js";
import { getDashboardStats } from "../services/dashboard.service.js";

export const showDashboardStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});