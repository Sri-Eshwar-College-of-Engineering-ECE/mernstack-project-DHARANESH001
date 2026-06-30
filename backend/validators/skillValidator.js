import { body } from "express-validator";

const CATEGORIES = [
  "Programming", "Frontend", "Backend", "Database",
  "DevOps", "Cloud", "AI/ML", "Tools", "Soft Skills", "Others",
];
const STATUSES = ["Not Started", "Learning", "Completed", "On Hold"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Expert"];

export const createSkillValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Skill name is required")
    .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters"),

  body("category")
    .optional()
    .isIn(CATEGORIES).withMessage("Invalid category"),

  body("currentLevel")
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage("Level must be between 1 and 10"),

  body("targetLevel")
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage("Target level must be between 1 and 10"),

  body("priority")
    .optional()
    .isIn(PRIORITIES).withMessage("Invalid priority"),

  body("difficulty")
    .optional()
    .isIn(DIFFICULTIES).withMessage("Invalid difficulty"),

  body("status")
    .optional()
    .isIn(STATUSES).withMessage("Invalid status"),

  body("estimatedHours")
    .optional()
    .isNumeric().withMessage("Estimated hours must be a number"),

  body("tags")
    .optional()
    .isArray().withMessage("Tags must be an array"),
];

export const updateSkillValidator = [
  ...createSkillValidator.map((v) => v.optional()),
];
