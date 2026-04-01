import express from "express";
import auth from "../middlewares/authMW.js";
import {
  register,
  login,
  getUserProfile,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile").get(auth, getUserProfile);
router.route("/logout").get(auth, logout);

export default router;
