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
const router = Router();

// re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/").get(getBootcamps).post(createBootcamp);

router.route("/:id/photo").put(uploadBootcampPhoto);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

export default router;
