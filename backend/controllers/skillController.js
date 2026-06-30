import { validationResult } from "express-validator";
import fs from "fs";
import Skill from "../models/Skill.js";

// Helper to build filter query
const buildQuery = (userId, query) => {
  const filter = { userId };
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  if (query.priority) filter.priority = query.priority;
  if (query.isFavorite === "true") filter.isFavorite = true;
  if (query.isBookmarked === "true") filter.isBookmarked = true;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { tags: { $regex: query.search, $options: "i" } },
    ];
  }
  return filter;
};

// Helper to build sort
const buildSort = (sortBy) => {
  const sorts = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "highest-level": { currentLevel: -1 },
    "lowest-level": { currentLevel: 1 },
    deadline: { targetDate: 1 },
    alphabetical: { name: 1 },
    progress: { progress: -1 },
  };
  return sorts[sortBy] || { createdAt: -1 };
};

// @desc    Get all skills (with filter, sort, paginate)
// @route   GET /api/skills
// @access  Private
export const getSkills = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, sortBy = "newest", ...queryParams } = req.query;
    const filter = buildQuery(req.user._id, queryParams);
    const sort = buildSort(sortBy);

    const total = await Skill.countDocuments(filter);
    const skills = await Skill.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: skills.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Private
export const getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found." });
    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Create skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const skill = await Skill.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, message: "Skill created!", data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) return res.status(404).json({ success: false, message: "Skill not found." });
    res.json({ success: true, message: "Skill updated!", data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found." });

    // Remove certificate file if exists
    if (skill.certificate && fs.existsSync(skill.certificate)) {
      fs.unlinkSync(skill.certificate);
    }

    await skill.deleteOne();
    res.json({ success: true, message: "Skill deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// @desc    Increase skill level
// @route   PATCH /api/skills/:id/increase
// @access  Private
export const increaseLevel = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found." });

    if (skill.currentLevel >= 10) {
      return res.status(400).json({ success: false, message: "Already at maximum level (10)." });
    }

    skill.currentLevel += 1;
    if (skill.status === "Not Started") skill.status = "Learning";
    await skill.save();

    res.json({ success: true, message: "Level increased!", data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Decrease skill level
// @route   PATCH /api/skills/:id/decrease
// @access  Private
export const decreaseLevel = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found." });

    if (skill.currentLevel <= 1) {
      return res.status(400).json({ success: false, message: "Already at minimum level (1)." });
    }

    skill.currentLevel -= 1;
    await skill.save();

    res.json({ success: true, message: "Level decreased!", data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skill stats for dashboard
// @route   GET /api/skills/stats
// @access  Private
export const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [total, completed, learning, notStarted, onHold, withCertificate] = await Promise.all([
      Skill.countDocuments({ userId }),
      Skill.countDocuments({ userId, status: "Completed" }),
      Skill.countDocuments({ userId, status: "Learning" }),
      Skill.countDocuments({ userId, status: "Not Started" }),
      Skill.countDocuments({ userId, status: "On Hold" }),
      Skill.countDocuments({ userId, certificate: { $ne: null } }),
    ]);

    const avgLevelAgg = await Skill.aggregate([
      { $match: { userId } },
      { $group: { _id: null, avgLevel: { $avg: "$currentLevel" }, avgProgress: { $avg: "$progress" } } },
    ]);

    const categoryDist = await Skill.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const priorityDist = await Skill.aggregate([
      { $match: { userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    // Upcoming deadlines (next 30 days)
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = await Skill.find({
      userId,
      targetDate: { $gte: now, $lte: in30Days },
      status: { $ne: "Completed" },
    })
      .select("name targetDate status priority category")
      .sort({ targetDate: 1 })
      .limit(5);

    const overdueSkills = await Skill.find({
      userId,
      targetDate: { $lt: now },
      status: { $ne: "Completed" },
    })
      .select("name targetDate status priority")
      .sort({ targetDate: 1 })
      .limit(5);

    const recentSkills = await Skill.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("name status category currentLevel updatedAt progress");

    res.json({
      success: true,
      data: {
        overview: {
          total, completed, learning, notStarted, onHold, withCertificate,
          avgLevel: avgLevelAgg[0]?.avgLevel?.toFixed(1) || 0,
          avgProgress: avgLevelAgg[0]?.avgProgress?.toFixed(1) || 0,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        },
        categoryDist,
        priorityDist,
        upcomingDeadlines,
        overdueSkills,
        recentSkills,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite
// @route   PATCH /api/skills/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found." });
    skill.isFavorite = !skill.isFavorite;
    await skill.save();
    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload certificate
// @route   POST /api/skills/:id/certificate
// @access  Private
export const uploadCertificate = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!skill) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Skill not found." });
    }

    // Delete old certificate
    if (skill.certificate && fs.existsSync(skill.certificate)) {
      fs.unlinkSync(skill.certificate);
    }

    skill.certificate = req.file.path.replace(/\\/g, "/");
    skill.certificateName = req.file.originalname;
    await skill.save();

    res.json({
      success: true,
      message: "Certificate uploaded successfully!",
      data: { certificate: skill.certificate, certificateName: skill.certificateName },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certificate
// @route   DELETE /api/skills/:id/certificate
// @access  Private
export const deleteCertificate = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found." });

    if (skill.certificate && fs.existsSync(skill.certificate)) {
      fs.unlinkSync(skill.certificate);
    }

    skill.certificate = null;
    skill.certificateName = null;
    await skill.save();

    res.json({ success: true, message: "Certificate deleted." });
  } catch (error) {
    next(error);
  }
};
