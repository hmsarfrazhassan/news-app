import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
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
  reason: {
    type: String,
    enum: ["fake_news", "spam", "abuse"],
    required: [true, "Reason is required."],
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved"],
    default: "pending",
  },
  actionTaken: {
    type: String,
    enum: ["edited", "deleted", "ignored"],
  },
});
reportSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model("Report", reportSchema);
