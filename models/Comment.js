import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
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
    comment: {
      type: String,
      required: [true, "Comment is required."],
      maxlength: [500, "Comment should not be more than 500 characters."],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: null,
    },
  },
  {
    timestamps: true,
  },
);

commentSchema.index({ postId: 1 });
commentSchema.index({ parentId: 1 });

export default mongoose.model("Comment", commentSchema);
