import { Router } from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courses.js";
import { verifyToken, checkUserRole } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(getCourses)
  .post(verifyToken, checkUserRole, createCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(verifyToken, checkUserRole, updateCourse)
  .delete(verifyToken, checkUserRole, deleteCourse);

export default router;
