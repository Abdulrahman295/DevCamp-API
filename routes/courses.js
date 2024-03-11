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
  .post(verifyToken, checkUserRole("publisher", "admin"), createCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(verifyToken, checkUserRole("publisher", "admin"), updateCourse)
  .delete(verifyToken, checkUserRole("publisher", "admin"), deleteCourse);

export default router;
