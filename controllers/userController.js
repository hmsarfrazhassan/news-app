import User from "../models/User.js";
import bcrypt from "bcrypt";
import { uploadToCloudinary } from "../../middlewares/cloudinary.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No record found",
      });
    }

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUsersByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    const users = await User.find({
      status,
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const softDeleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findByIdAndUpdate(userId, {
      returnDocument: "after",
      validators: true,
      new: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User soft deleted successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const restoreUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: false },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "User restored",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { password, phone, role } = req.body || {};
    const file = req.file || (req.files && req.files[0]);

    if (!password && !phone && !file && !role) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.user.role !== "admin" && req.user.id !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (phone) {
      user.phone = phone;
    }

    if (file) {
      try {
        const result = await uploadToCloudinary(file.buffer, file.originalname);
        user.imageUrl = result.secure_url || result.url;
      } catch (uploadErr) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
          error: uploadErr.message,
        });
      }
    }

    if (role) {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Only admin can change roles",
        });
      }

      user.role = role;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
