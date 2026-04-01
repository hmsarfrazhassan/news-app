// models/RefreshToken.js
import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required."],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
  },
  { timestamps: true },
);

export default mongoose.model("RefreshToken", refreshTokenSchema);
