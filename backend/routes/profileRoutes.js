import express from "express";
import {
  getProfile, updateProfile, uploadAvatar, uploadResume, changePassword,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadAvatar as avatarUpload, uploadResume as resumeUpload } from "../middlewares/upload.js";

const router = express.Router();

router.use(protect);

router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/password", changePassword);
router.post("/avatar", avatarUpload.single("avatar"), uploadAvatar);
router.post("/resume", resumeUpload.single("resume"), uploadResume);

export default router;
