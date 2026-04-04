import express from "express";
import auth from "../middlewares/authMW.js";
import {
  addReport,
  getUserReports,
  getAllReportedPosts,
  getReportedPost,
  deleteReport,
  updateReport,
} from "../controllers/reportController.js";
import isAdmin from "../middlewares/adminMW.js";

const router = express.Router();

router.route("/add").post(auth, addReport);
router.route("/me").get(auth, getUserReports);
router.route("/all").get(auth, isAdmin, getAllReportedPosts);
router.route("/:id").get(auth, getReportedPost);
router.route("/:id").delete(auth, isAdmin, deleteReport);
router.route("/:id").put(auth, isAdmin, updateReport);

export default router;
