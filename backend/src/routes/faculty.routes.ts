import { Router } from "express";
import {
  listFaculty,
  showFacultyMember,
} from "../controllers/faculty.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, listFaculty);
router.get("/:id", authenticate, showFacultyMember);

export default router;