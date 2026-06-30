import express from "express";
import {
  getSkills, getSkill, createSkill, updateSkill, deleteSkill,
  increaseLevel, decreaseLevel, getStats, toggleFavorite,
  uploadCertificate, deleteCertificate,
} from "../controllers/skillController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { createSkillValidator, updateSkillValidator } from "../validators/skillValidator.js";
import { uploadCertificate as uploadMiddleware } from "../middlewares/upload.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.get("/stats", getStats);
router.get("/", getSkills);
router.get("/:id", getSkill);
router.post("/", createSkillValidator, createSkill);
router.put("/:id", updateSkillValidator, updateSkill);
router.delete("/:id", deleteSkill);

router.patch("/:id/increase", increaseLevel);
router.patch("/:id/decrease", decreaseLevel);
router.patch("/:id/favorite", toggleFavorite);

router.post("/:id/certificate", uploadMiddleware.single("certificate"), uploadCertificate);
router.delete("/:id/certificate", deleteCertificate);

export default router;
