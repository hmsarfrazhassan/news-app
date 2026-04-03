import Favorite from "../models/Favorite.js";
import Post from "../models/Post.js";

export const addFavorite = async (req, res) => {
  try {
    const postId = req.body.postId;
    const userId = req.user.userId;
    if (!postId) {
      res.status(400).json({ success: false, message: "Postid is required." });
    }
    const post = await Post.findById({ _id: postId });
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "PostId is not valid.",
      });
    }
    const isFavorite = await Favorite.findOne({ userId, postId });
    if (isFavorite) {
      res.status(400).json({
        success: false,
        message: "Post is already in your favorite list.",
      });
    }
    if (!isFavorite) {
      const favorite = await Favorite.create({ userId, postId });
      if (favorite) {
        return res.status(201).json({
          success: true,
          message: "Post added to your favorite.",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const getAllFavoritePosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const favoritePosts = await Favorite.find({ userId }).populate("postId");
    if (!favoritePosts.length) {
      return res.status(400).json({
        success: false,
        message: "No record found",
      });
    }
    return res.status(200).json({
      success: true,
      data: favoritePosts,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      data: `Error: ${error.message}`,
    });
  }
};

export const removePostFromFavorite = async (req, res) => {
  try {
    const favId = req.body.favPostId;
    const favroitPost = await Favorite.findById(favId);
    if (!favroitPost) {
      return res.status(400).json({
        success: false,
        message: "No record found",
      });
    }
    if (favroitPost) {
      const post = await Favorite.findByIdAndDelete(favId);
      return res.status(200).json({
        success: true,
        message: "Post removed from favorite",
      });
    }
  } catch (error) {
    return res.status(200).json({
      success: false,
      data: `Error: ${error.message}`,
    });
  }
};
