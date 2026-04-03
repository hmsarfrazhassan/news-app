import express from "express";
import {
  addReaction,
  getAllReactedPostsByUser,
} from "../controllers/reactionController.js";
import auth from "../middlewares/authMW.js";

const router = express.Router();

router.route("/").post(auth, addReaction);
router.route("/posts").get(auth, getAllReactedPostsByUser);

export default router;
