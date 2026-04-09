import express from "express";
import {
  getAllUsers,
  getUsersByStatus,
  softDeleteUser,
  restoreUser,
  updateProfile,
} from "../controllers/userController.js";
import auth from "../middlewares/authMW.js";
import isAdmin from "../middlewares/adminMW";

const router = express.Router();

router.route("/").get(auth, isAdmin, getAllUsers);
router.route("/:status").get(auth, isAdmin, getUsersByStatus);
router.route("/delete/:id").patch(auth, isAdmin, softDeleteUser);
router.route("/restore/:id").patch(auth, isAdmin, restoreUser);
router.route("/update/:id").put(auth, updateProfile);
