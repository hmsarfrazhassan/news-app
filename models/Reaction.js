import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required."],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post id is required"],
    },
    reactionType: {
      type: String,
      enum: ["like", "dislike"],
      lowercase: true,
      required: [true, "Like or dislike reaction is required"],
    },
  },
  { timestamps: true },
);
reactionSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model("Reaction", reactionSchema);
