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
import { verifyToken, checkUserRole } from "../middleware/auth.js";
const router = Router();

// re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(getBootcamps)
  .post(verifyToken, checkUserRole, createBootcamp);

router.route("/:id/photo").put(verifyToken, checkUserRole, uploadBootcampPhoto);

router
  .route("/:id")
  .get(getBootcamp)
  .put(verifyToken, checkUserRole, updateBootcamp)
  .delete(verifyToken, checkUserRole, deleteBootcamp);

export default router;
