import slugify from "slugify";
import { uploadToCloudinary } from "../../middlewares/cloudinary.js";
import newsPost from "../../models/Post.js";
import Category from "../../models/Category.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Post title, content and category are required",
      });
    }

    const isCategory = await Category.findById(category);
    if (!isCategory) {
      return res.status(400).json({
        success: false,
        message: "Category does not exist.",
      });
    }

    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({
        message:
          "No image file provided. Please upload an image using form-data.",
      });
    }

    // Upload to Cloudinary
    let imageUrl;
    try {
      const result = await uploadToCloudinary(file.buffer, file.originalname);
      imageUrl = result.secure_url || result.url;
    } catch (uploadErr) {
      console.error("Cloudinary upload failed:", uploadErr);
      return res.status(500).json({
        message: "Image upload to cloud failed",
        error: uploadErr.message,
      });
    }

    // Create a slug for title of post
    const baseSlug = slugify(title, { lower: true, strict: true });

    let slug = baseSlug;
    let counter = 1;

    while (await newsPost.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Save post data with image to database
    const newPost = new newsPost({
      title,
      content,
      slug,
      coverImage: imageUrl,
      postedBy: req.user.userId,
      category: req.body.category,
    });
    await newPost.save();

    res.status(201).json({
      message: "Post successfully created.",
      data: newPost,
    });
  } catch (error) {
    console.error("Error occurred while creating a post.:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
