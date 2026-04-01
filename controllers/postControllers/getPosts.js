import Post from "../../models/Post.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    if (!posts.length > 0) {
      return res.status(400).json({
        success: false,
        message: "No record found",
      });
    }
    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Post id is required",
      });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "No record found",
      });
    }
    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
