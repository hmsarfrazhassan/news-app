import express from "express";
import { addReaction } from "../controllers/reactionController.js";
import auth from "../middlewares/authMW.js";

const router = express.Router();

router.route("/").post(auth, addReaction);

export default router;
