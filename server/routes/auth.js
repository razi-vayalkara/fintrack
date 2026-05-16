import express from "express";
import {
  changePassword,
  deleteAccount,
  getMe,
  login,
  register,
  updateSettings
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/settings", protect, updateSettings);
router.patch("/password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

export default router;
