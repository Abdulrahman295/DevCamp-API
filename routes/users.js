import { Router } from "express";
import {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.js";
import { verifyToken, checkUserRole } from "../middleware/auth.js";

const router = Router();

router.use(verifyToken);

router.use(checkUserRole("admin"));

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
