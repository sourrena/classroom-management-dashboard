import { Router } from "express";
import {
  addDepartment,
  editDepartment,
  listDepartments,
  showDepartment,
} from "../controllers/department.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { teacherOnly } from "../middleware/role.middleware.js";
import { validateRequestBody } from "../middleware/validate.middleware.js";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "../validators/department.validator.js";

const router = Router();

router.get("/", authenticate, listDepartments);

router.get("/:id", authenticate, showDepartment);

router.post(
  "/",
  authenticate,
  teacherOnly,
  validateRequestBody(createDepartmentSchema),
  addDepartment
);

router.patch(
  "/:id",
  authenticate,
  teacherOnly,
  validateRequestBody(updateDepartmentSchema),
  editDepartment
);

export default router;