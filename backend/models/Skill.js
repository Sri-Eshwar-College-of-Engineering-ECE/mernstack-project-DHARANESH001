import mongoose from "mongoose";

const CATEGORIES = [
  "Programming", "Frontend", "Backend", "Database",
  "DevOps", "Cloud", "AI/ML", "Tools", "Soft Skills", "Others",
];

const STATUSES = ["Not Started", "Learning", "Completed", "On Hold"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Expert"];

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      maxlength: [100, "Skill name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: "Others",
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    currentLevel: {
      type: Number,
      default: 1,
      min: [1, "Level cannot be less than 1"],
      max: [10, "Level cannot exceed 10"],
    },
    targetLevel: {
      type: Number,
      default: 10,
      min: [1, "Target level cannot be less than 1"],
      max: [10, "Target level cannot exceed 10"],
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: "Medium",
    },
    difficulty: {
      type: String,
      enum: DIFFICULTIES,
      default: "Beginner",
    },
    learningSource: {
      type: String,
      maxlength: [200, "Learning source cannot exceed 200 characters"],
      default: "",
    },
    estimatedHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
      default: null,
    },
    targetDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "Not Started",
    },
    certificate: {
      type: String,
      default: null,
    },
    certificateName: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],
    isFavorite: { type: Boolean, default: false },
    isBookmarked: { type: Boolean, default: false },
    xpEarned: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate progress based on level
skillSchema.pre("save", function (next) {
  if (this.isModified("currentLevel") || this.isModified("targetLevel")) {
    this.progress = Math.round((this.currentLevel / this.targetLevel) * 100);
    if (this.progress >= 100) {
      this.status = "Completed";
      this.progress = 100;
    }
  }
  next();
});

// Indexes for performance
skillSchema.index({ userId: 1, status: 1 });
skillSchema.index({ userId: 1, category: 1 });
skillSchema.index({ userId: 1, priority: 1 });
skillSchema.index({ name: "text", description: "text", tags: "text" });

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
