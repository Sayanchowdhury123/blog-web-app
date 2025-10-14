const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const Editoranalytics = require("../models/Editoranalytics");

exports.blogreviewed = async (req, res) => {
  const { blogid } = req.body;
  try {
    let analytics = await Editoranalytics.findOne({ editor: req.user.id });

    if (!analytics) {
      analytics = await Editoranalytics.create({
        editor: req.user.id,
        blogsReviewed: [blogid],
      });
    } else {
      if (!analytics.blogsReviewed.includes(blogid)) {
        analytics.blogsReviewed.push(blogid);
        await analytics.save();
      }
    }

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
    console.log(error);
  }
};

exports.blogedited = async (req, res) => {
  const { blogid } = req.body;
  try {
    let analytics = await Editoranalytics.findOne({ editor: req.user.id });
    if (!analytics) {
      analytics = await Editoranalytics.create({
        editor: req.user.id,
        blogsEdited: [{ blogid, editedAt: new Date() }],
      });
    } else {
      const alreadedited = analytics.blogsEdited.find(
        (b) => String(b.blogid) === String(blogid)
      );

      alreadedited.editedAt = new Date();
      await analytics.save();
    }
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
    console.log(error);
  }
};

exports.editexit = async (req, res) => {
  const { blogid } = req.body;
  try {
    let analytics = await Editoranalytics.findOne({
      editor: req.user.id,
    });

    if (!analytics) {
      return res
        .status(404)
        .json({ msg: "Analytics not found for this editor" });
    }

    const findblog = analytics.blogsEdited.find(
      (b) => String(b.blogid) === String(blogid)
    );

    if (!findblog) {
      return res.status(404).json({ msg: "Blog not found in analytics" });
    }

    findblog.exitAt = new Date() || 0;
    findblog.duration = (findblog.exitAt - findblog.editedAt) / 1000;
    await analytics.save();

    res.status(200).json(findblog);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
    console.log(error);
  }
};

exports.geteditedbloginfo = async (req, res) => {
  try {
    const alldata = await Editoranalytics.find({
      editor: req.user.id,
    }).populate({
      path: "blogsEdited.blogid", 
      select: "title views likes", 
    });

    if (!alldata) {
      return res.status(404).json("no data found");
    }

    res.status(200).json(alldata);
  } catch (error) {
    console.log(error);
  }
};

exports.getApprovalRate = async (req, res) => {
  try {
    const analytics = await Editoranalytics.findOne({ editor: req.user.id });

    if (!analytics || analytics.blogsReviewed.length === 0) {
      return res.status(200).json({
        success: true,
        totalReviewed: 0,
        approved: 0,
        approvalRate: 0,
        msg: "No reviews yet",
      });
    }

    const totalReviewed = analytics.blogsReviewed.length;
    const allblogs = await Blogs.find();
    const approvedCount = allblogs.filter((b) => b.approval === true).length;
    const disapprovedCount = allblogs.filter(
      (b) => b.approval === false
    ).length;

    const approvalRate = ((approvedCount / totalReviewed) * 100).toFixed(2);
    const disapprovalRate = ((disapprovedCount / totalReviewed) * 100).toFixed(
      2
    );

    res.status(200).json({
      success: true,
      totalReviewed,
      approved: approvedCount,
      disapproved: disapprovedCount,
      approvalRate,
      disapprovalrate: disapprovalRate,
    });
  } catch (error) {
    console.error("Error getting approval rate:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
