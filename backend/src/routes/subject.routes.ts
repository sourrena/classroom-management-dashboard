import { Router } from "express";
import {
  addSubject,
  editSubject,
  listSubjects,
  showSubject,
} from "../controllers/subject.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { teacherOnly } from "../middleware/role.middleware.js";
import { validateRequestBody } from "../middleware/validate.middleware.js";
import {
  createSubjectSchema,
  updateSubjectSchema,
} from "../validators/subject.validator.js";

const router = Router();

router.get("/", authenticate, listSubjects);
router.get("/:id", authenticate, showSubject);

router.post(
  "/",
  authenticate,
  teacherOnly,
  validateRequestBody(createSubjectSchema),
  addSubject
);

router.patch(
  "/:id",
  authenticate,
  teacherOnly,
  validateRequestBody(updateSubjectSchema),
  editSubject
);

export default router;