import { Router } from "express";
import { showDashboardStats } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/stats", authenticate, showDashboardStats);

export default router;