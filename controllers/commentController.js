import req from "express/lib/request";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const addComment = async (req, res) => {
  try {
    const { postId, comment, parentId } = req.body;
    const userId = req.user.userId;

    if (!postId || !comment) {
      return res.status(400).json({
        success: false,
        message: "PostId and comment are required",
      });
    }

    let parentComment = null;

    if (parentId) {
      parentComment = await Comment.findById(parentId);

      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }
    }

    const newComment = await Comment.create({
      userId,
      postId,
      comment,
      parentId: parentId || null,
    });

    res.status(201).json({
      success: true,
      message: parentId
        ? "Reply added successfully"
        : "Comment added successfully",
      data: newComment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCommentsOnPost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Postid is required",
      });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found.",
      });
    }
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    if (!comments.length) {
      return res.status(400).json({
        success: false,
        message: "No comment found on post",
      });
    }
    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      messsage: `Error: ${error.message}`,
    });
  }
};

export const deleteAComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(400).josn({
        success: false,
        message: `Comment not found with the porvided Id.`,
      });
    }
    return res.status(200).josn({
      success: true,
      message: `Comment successfully deleted`,
    });
  } catch (error) {
    res.status(400).josn({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const updateAComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findByIdAndUpdate(commentId, req.body, {
      returnDocument: "after",
      validators: true,
    });
    if (!comment) {
      return res.status(400).josn({
        success: false,
        message: `Comment not found with the porvided Id.`,
      });
    }
    return res.status(200).josn({
      success: true,
      message: `Comment successfully updated`,
    });
  } catch (error) {
    res.status(400).josn({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const getAComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(400).josn({
        success: false,
        message: `Comment not found with the porvided Id.`,
      });
    }
    return res.status(200).josn({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(400).josn({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};
