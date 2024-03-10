import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  forgotPassword,
} from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);
router.post("/forgotpassword", forgotPassword);

export default router;
