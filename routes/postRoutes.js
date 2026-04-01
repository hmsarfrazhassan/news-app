import express from "express";
import { upload } from "../middlewares/cloudinary.js";
import auth from "../middlewares/authMW.js";
import isAdmin from "../middlewares/adminMW.js";
import { createPost } from "../controllers/postControllers/createPost.js";
import {
  deletePost,
  updatePost,
} from "../controllers/postControllers/updatePost.js";
import { getPost, getPosts } from "../controllers/postControllers/getPosts.js";

const router = express.Router();

function handleMulterErrors(mw) {
  return function (req, res, next) {
    mw(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
}

router
  .route("/")
  .post(auth, isAdmin, handleMulterErrors(upload.any()), createPost);

router
  .route("/:id")
  .put(auth, isAdmin, handleMulterErrors(upload.any()), updatePost);

router.route("/:id").get(getPost);
router.route("/").get(getPosts);
router.route("/:id").delete(auth, isAdmin, deletePost);

export default router;
