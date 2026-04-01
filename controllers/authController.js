import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }
    const isUserExist = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message:
          "Username or email address already taken. Please use other username or email address.",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
    });
    return res.status(201).json({
      success: true,
      message: "User successfully registered",
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(404).josn({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Use valid email and password.",
      });
    }
    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid email and password",
      });
    }

    if (isMatched) {
      const payload = {
        userId: user._id,
        email: user.email,
        useranem: user.username,
        role: user.role,
      };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXP || "15m",
      });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
        expiresIn: "7d",
      });
      await User.findByIdAndUpdate(user._id, { refreshToken });

      res.status(200).json({
        success: true,
        message: "User successfully loggedin",
        token: accessToken,
        refreshToken: refreshToken,
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

// On logout — just revoke it
export const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user.userId, { refreshToken: null });
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (user) {
      return res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: `Error ${error.message}`,
    });
  }
};
