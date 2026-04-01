import Post from "../../models/Post.js";
import Category from "../../models/Category.js";
import { uploadToCloudinary } from "../../middlewares/cloudinary.js";
import slugify from "slugify";

export const updatePost = async (req, res) => {
  try {
    const { title, content, category, status, tags } = req.body || {};
    const file = req.file || (req.files && req.files[0]);

    if (!title && !content && !category && !status && !tags && !file) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided to update the post.",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Validate category if provided
    if (category) {
      const isCategory = await Category.findById(category);
      if (!isCategory) {
        return res.status(400).json({
          message: "Category does not exist.",
        });
      }
      post.category = category;
    }

    // Update basic fields
    if (title) {
      post.title = title;

      // regenerate slug
      let baseSlug = slugify(title, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;

      while (await Post.findOne({ slug, _id: { $ne: post._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      post.slug = slug;
    }

    if (content) post.content = content;
    if (status) post.status = status;
    if (tags) post.tags = tags;

    // Handle image update
    if (file) {
      try {
        const result = await uploadToCloudinary(file.buffer, file.originalname);
        post.coverImage = result.secure_url || result.url;
      } catch (uploadErr) {
        return res.status(500).json({
          message: "Image upload failed",
          error: uploadErr.message,
        });
      }
    }

    // Save updated post
    await post.save();

    // Send clean response
    res.json({
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Post id is required",
      });
    }
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "No record found",
      });
    }
    return res.status(200).json({
      success: true,
      message: `Post with id ${id} successfully deleted `,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
