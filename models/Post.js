import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [100, "Title must not be more than 100 chracters."],
    },
    slug: {
      type: String,
      unique: [true, "Title already taken. Use another title."],
    },
    content: {
      type: String,
      required: [true, "content is required."],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    coverImage: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enums: ["draft", "published"],
      default: "draft",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Post", postSchema);
