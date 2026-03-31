import User from "../models/User.js";
import bcrypt from "bcrypt";

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
