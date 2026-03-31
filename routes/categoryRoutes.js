import express from "express";
import auth from "../middlewares/authMW.js";
import isAdmin from "../middlewares/adminMW.js";
import {
  getCategories,
  createCategory,
  getCategory,
  deleteCategory,
  updatedCategory,
} from "../controllers/categoryController.js";
const router = express.Router();

router.route("/").get(getCategories);
router.route("/").post(auth, isAdmin, createCategory);
router.route("/:id").get(getCategory);
router.route("/:id").delete(auth, isAdmin, deleteCategory);
router.route("/:id").put(auth, isAdmin, updatedCategory);

export default router;
