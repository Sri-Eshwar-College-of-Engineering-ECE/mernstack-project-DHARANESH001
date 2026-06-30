import multer from "multer";
import path from "path";
import fs from "fs";

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `uploads/${folder}`;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${req.user.id}_${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

const fileFilter = (allowedTypes) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`), false);
  }
};

export const uploadCertificate = multer({
  storage: createStorage("certificates"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter([".pdf", ".jpg", ".jpeg", ".png"]),
});

export const uploadAvatar = multer({
  storage: createStorage("avatars"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter([".jpg", ".jpeg", ".png", ".webp"]),
});

export const uploadResume = multer({
  storage: createStorage("resumes"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter([".pdf"]),
});
