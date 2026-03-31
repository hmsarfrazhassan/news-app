import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      min: [5, "Username must be atleast 5 chracters"],
      max: [30, "Username must not be more theb 30 chracters"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email address is required"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },
    phone: {
      type: Number,
      trim: true,
      match: [/^[0-9]{11,}$/, "Please enter a valid phone number"],
    },
    imageUrl: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isEditor: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
