import fs from "fs";
import User from "../models/User.js";

// @desc    Get profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ["name", "bio", "github", "linkedin", "portfolio", "learningGoal"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: "Profile updated!", data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   POST /api/profile/avatar
// @access  Private
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const user = await User.findById(req.user._id);

    // Delete old avatar
    if (user.avatar && fs.existsSync(user.avatar)) {
      fs.unlinkSync(user.avatar);
    }

    user.avatar = req.file.path.replace(/\\/g, "/");
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: "Avatar updated!", data: { avatar: user.avatar } });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   POST /api/profile/resume
// @access  Private
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const user = await User.findById(req.user._id);

    if (user.resume && fs.existsSync(user.resume)) {
      fs.unlinkSync(user.resume);
    }

    user.resume = req.file.path.replace(/\\/g, "/");
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: "Resume uploaded!", data: { resume: user.resume } });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/profile/password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both passwords required." });
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully!" });
  } catch (error) {
    next(error);
  }
};
