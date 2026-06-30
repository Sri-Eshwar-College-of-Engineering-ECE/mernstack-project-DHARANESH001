import express from "express";
import { register, login, getMe, logout } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { registerValidator, loginValidator } from "../validators/authValidator.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, registerValidator, register);
router.post("/login", authLimiter, loginValidator, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
