import mongoose from "mongoose";

const favoritePost = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserId is required"],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "PostId is required"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Favorite", favoritePost);
