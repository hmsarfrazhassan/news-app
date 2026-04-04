import Report from "../models/Report.js";
import Post from "../models/Post.js";

export const addReport = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId, reason } = req.body;

    if (!postId || !reason) {
      return res.status(400).json({
        success: false,
        message: "postId and reason of report are required",
      });
    }
    if (!["fake_news", "spam", "abuse"].includes(reason)) {
      return res.status(400).json({
        success: false,
        message: "Only allowed reasons are fake_news, spam and abuse.",
      });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Record not found",
      });
    }
    const newReport = await Report.create({
      userId,
      postId,
      reason,
      ...req.body,
    });

    if (newReport) {
      await Post.findByIdAndUpdate(postId, {
        isFlagged: true,
      });
    }
    return res.status(201).json({
      success: true,
      message: "Report successfully created",
      data: newReport,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reported this post.",
      });
    }
    return res.status(400).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const getUserReports = async (req, res) => {
  try {
    const posts = await Report.find({ userId: req.user.userId }).populate(
      "postId",
    );
    if (!posts.length) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }
    const formatted = posts.map((r) => ({
      _id: r._id,
      reason: r.reason,
      post: r.postId,
    }));
    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    return res.status(400).json({
      sussess: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const getAllReportedPosts = async (req, res) => {
  try {
    const reports = await Report.aggregate([
      // 1. Group by postId + reason
      {
        $group: {
          _id: {
            postId: "$postId",
            reason: "$reason",
          },
          count: { $sum: 1 },
        },
      },

      // 2. Group again by postId
      {
        $group: {
          _id: "$_id.postId",
          reportCount: { $sum: "$count" },
          reasons: {
            $push: {
              k: "$_id.reason",
              v: "$count",
            },
          },
        },
      },

      // 3. Convert reasons array → object
      {
        $addFields: {
          reasons: { $arrayToObject: "$reasons" },
        },
      },

      // 4. Lookup post
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "_id",
          as: "post",
        },
      },

      // 5. Unwind post
      {
        $unwind: "$post",
      },

      // 6. Final shape
      {
        $project: {
          _id: 0,
          post: 1,
          reportCount: 1,
          reasons: 1,
        },
      },

      // 7. Sort
      {
        $sort: { reportCount: -1 },
      },
    ]);

    if (!reports.length) {
      return res.status(404).json({
        success: false,
        message: "No reported posts found",
      });
    }

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const getReportedPost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Post id is required",
      });
    }
    const report = await Report.findById(id).populate("postId");
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    const reportObj = report.toObject();

    reportObj.post = reportObj.postId;
    delete reportObj.postId;

    return res.status(200).json({
      success: true,
      data: reportObj,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Erroe: ${error.message}`,
    });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Post id is required",
      });
    }
    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report successfully deleted",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Erroe: ${error.message}`,
    });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Post id is required",
      });
    }
    const report = await Report.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      validators: true,
    }).populate("postId");
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }
    const reportObj = report.toObject();

    reportObj.post = reportObj.postId;
    delete reportObj.postId;

    return res.status(200).json({
      success: true,
      data: reportObj,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Erroe: ${error.message}`,
    });
  }
};
