import express from "express";

import auth from "../middlewares/authMW.js";
import isAdmin from "../middlewares/adminMW.js";
import {
  addComment,
  deleteAComment,
  updateAComment,
  getAComment,
  getAllCommentsOnPost,
} from "../controllers/commentController.js";

const router = express.Router();

router.route("/post").post(auth, addComment);
router.route("/:id/post").get(auth, getAllCommentsOnPost);
router.route("/:id").get(auth, getAComment);
router.route("/:id").delete(auth, isAdmin, deleteAComment);
router.route("/:id").put(auth, isAdmin, updateAComment);

export default router;
