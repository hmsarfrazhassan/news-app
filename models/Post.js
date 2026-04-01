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
  },
  { timestamps: true },
);

// postSchema.pre("save", function () {
//   if (!this.slug) {
//     this.slug = slugify(this.title, { lower: true, strict: true });
//   }
// });

// postSchema.pre("save", async function (next) {
//   if (!this.slug) {
//     let baseSlug = slugify(this.title, { lower: true, strict: true });
//     let slug = baseSlug;

//     let counter = 1;

//     // 🔁 Check for existing slug
//     while (await newsPost.findOne({ slug })) {
//       slug = `${baseSlug}-${counter}`;
//       counter++;
//     }

//     this.slug = slug;
//   }

//   next();
// });
export default mongoose.model("Post", postSchema);
