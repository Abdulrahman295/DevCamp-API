import { Router } from "express";
import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviews.js";
import { verifyToken, checkUserRole } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(getReviews)
  .post(verifyToken, checkUserRole("user", "admin"), createReview);

router
  .route("/:id")
  .get(getReview)
  .put(verifyToken, checkUserRole("user", "admin"), updateReview)
  .delete(verifyToken, checkUserRole("user", "admin"), deleteReview);

export default router;
