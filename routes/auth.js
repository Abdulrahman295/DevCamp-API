import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateEmail,
  updatePassword,
} from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);
router.put("/updateemail", verifyToken, updateEmail);
router.put("/updatepassword", verifyToken, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

export default router;
