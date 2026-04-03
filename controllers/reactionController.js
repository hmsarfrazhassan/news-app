import Reaction from "../models/Reaction.js";
import Post from "../models/Post.js";
export const addReaction = async (req, res) => {
  try {
    const { postId, reactionType } = req.body;

    if (!postId || !reactionType) {
      return res.status(400).json({
        success: false,
        message: "PostId and reactionType are required",
      });
    }

    const reactType = reactionType.toLowerCase();

    if (!["like", "dislike"].includes(reactType)) {
      return res.status(400).json({
        success: false,
        message: "Like or dislike are only allowed.",
      });
    }

    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const existingReaction = await Reaction.findOne({ userId, postId });

    let responseMessage;
    let responseData = null;
    let statusCode = 200;

    if (!existingReaction) {
      responseData = await Reaction.create({
        userId,
        postId,
        reactionType: reactType,
      });
      responseMessage = `${reactType} added`;
      statusCode = 201;
    } else if (existingReaction.reactionType === reactType) {
      await Reaction.deleteOne({ _id: existingReaction._id });
      responseMessage = `${reactType} removed`;
    } else {
      existingReaction.reactionType = reactType;
      responseData = await existingReaction.save();
      responseMessage = `Reaction updated to ${reactType}`;
    }

    const [likes, dislikes] = await Promise.all([
      Reaction.countDocuments({ postId, reactionType: "like" }),
      Reaction.countDocuments({ postId, reactionType: "dislike" }),
    ]);

    await Post.findByIdAndUpdate(postId, { $set: { likes, dislikes } });

    return res.status(statusCode).json({
      success: true,
      message: responseMessage,
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllReactedPostsByUser = async (req, res) => {
  try {
    const posts = await Reaction.find({ userId: req.user.userId }).populate(
      "postId",
    );
    if (!posts.length) {
      return res.status(404).json({
        success: false,
        message: "No record found",
      });
    }
    const formatted = posts.map((r) => ({
      reactionType: r.reactionType,
      post: r.postId,
    }));

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
