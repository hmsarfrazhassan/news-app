import express from "express";
import {
  addFavorite,
  getAllFavoritePosts,
  removePostFromFavorite,
} from "../controllers/favoriteController.js";
import auth from "../middlewares/authMW.js";

const router = express.Router();

router.route("/add").post(auth, addFavorite);
router.route("/me").get(auth, getAllFavoritePosts);
router.route("/remove").delete(auth, removePostFromFavorite);

export default router;
