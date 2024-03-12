import { Router } from "express";
import {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  uploadBootcampPhoto,
} from "../controllers/bootcamps.js";
import courseRouter from "./courses.js";
import reviewsRouter from "./reviews.js";
import { verifyToken, checkUserRole } from "../middleware/auth.js";
const router = Router();

// re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewsRouter);

router
  .route("/")
  .get(getBootcamps)
  .post(verifyToken, checkUserRole("publisher", "admin"), createBootcamp);

router
  .route("/:id/photo")
  .put(verifyToken, checkUserRole("publisher", "admin"), uploadBootcampPhoto);

router
  .route("/:id")
  .get(getBootcamp)
  .put(verifyToken, checkUserRole("publisher", "admin"), updateBootcamp)
  .delete(verifyToken, checkUserRole("publisher", "admin"), deleteBootcamp);

export default router;
