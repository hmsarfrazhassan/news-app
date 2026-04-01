import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.C_CLOUD_NAME,
  api_key: process.env.C_API_KEY,
  api_secret: process.env.C_API_SECRET_KEY,
  secure: true,
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
    "image/avif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, JPEG, PNG, GIF, and WEBP files are allowed.",
      ),
      false,
    );
  }
};

// Use memory storage so we can stream the file buffer to Cloudinary
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
    files: 1,
  },
  fileFilter: fileFilter,
});

// helper to upload buffer to Cloudinary
export function uploadToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "AB-Img/images",
        transformation: [
          { width: 800, height: 800, crop: "limit", quality: "auto" },
        ],
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

// Error handling middleware for file uploads (Express error handler)
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size is too large. Maximum size is 10MB.",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    // An unknown error occurred
    return res
      .status(400)
      .json({ success: false, message: err.message || "Error uploading file" });
  }
  next();
};

export default { cloudinary, upload, handleUploadError, uploadToCloudinary };

// This file configures Cloudinary for image storage and sets up Multer middleware for handling file uploads.
// It ensures that only image files are uploaded and applies transformations for optimization.
