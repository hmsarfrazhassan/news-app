import express from "express";
import auth from "../middlewares/authMW.js";
import {
  register,
  login,
  getUserProfile,
} from "../controllers/authController.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile").get(auth, getUserProfile);

export default router;
