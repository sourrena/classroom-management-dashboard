import { Router } from "express";
import {
  addClass,
  editClass,
  listClasses,
  removeClass,
  showClass,
} from "../controllers/class.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { teacherOnly } from "../middleware/role.middleware.js";
import { validateRequestBody } from "../middleware/validate.middleware.js";
import {
  createClassSchema,
  updateClassSchema,
} from "../validators/class.validator.js";

const router = Router();

router.get("/", authenticate, listClasses);
router.get("/:id", authenticate, showClass);

router.post(
  "/",
  authenticate,
  teacherOnly,
  validateRequestBody(createClassSchema),
  addClass
);

router.patch(
  "/:id",
  authenticate,
  teacherOnly,
  validateRequestBody(updateClassSchema),
  editClass
);

router.delete("/:id", authenticate, teacherOnly, removeClass);

export default router;