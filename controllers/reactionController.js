import Reaction from "../models/Reaction.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const addReaction = async (req, res) => {
  try {
    const { postId, reactionType } = req.body;
    const reactType = reactionType.toLowerCase();

    if (!postId || !reactionType) {
      return res.status(400).json({
        success: false,
        message: "PostId and reactionType are required",
      });
    }
    if (!["like", "dislike"].includes(reactType)) {
      return res.status(400).json({
        success: false,
        message: "Like or dislike are only allowed.",
      });
    }

    const user = await User.findById(req.user.userId);
    const post = await Post.findById(postId);

    if (!user || !post) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const existingReaction = await Reaction.findOne({
      userId: req.user.userId,
      postId,
    });

    if (!existingReaction) {
      const newReaction = await Reaction.create({
        userId: req.user.userId,
        postId,
        reactionType,
      });

      return res.status(201).json({
        success: true,
        message: `${reactType} added`,
        data: newReaction,
      });
    }

    if (existingReaction.reactionType === reactType) {
      await Reaction.deleteOne({ _id: existingReaction._id });

      return res.status(200).json({
        success: true,
        message: `${reactType} removed`,
      });
    }

    existingReaction.reactionType = reactType;
    await existingReaction.save();

    return res.status(200).json({
      success: true,
      message: `Reaction updated to ${reactType}`,
      data: existingReaction,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      erroe: error.message,
    });
  }
};
