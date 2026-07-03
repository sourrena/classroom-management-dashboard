import { Router } from "express";
import {
  addEnrollment,
  listEnrollments,
  removeEnrollment,
} from "../controllers/enrollment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { studentOnly } from "../middleware/role.middleware.js";
import { validateRequestBody } from "../middleware/validate.middleware.js";
import { createEnrollmentSchema } from "../validators/enrollment.validator.js";

const router = Router();

router.get("/", authenticate, listEnrollments);

router.post(
  "/",
  authenticate,
  studentOnly,
  validateRequestBody(createEnrollmentSchema),
  addEnrollment
);

router.delete("/:id", authenticate, removeEnrollment);

export default router;