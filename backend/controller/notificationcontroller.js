const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const Notification = require("../models/Notification");


exports.blogapprovednotify = async (req, res) => {
  const { blogtitle, creator, blogid } = req.body;
  try {
    if (!creator || !blogtitle || !blogid) {
      return res.status(400).json({ msg: "Missing required fields" });
    }
    let newMessage = `🎉 Your blog ${blogtitle} has been approved!`;

    const newnotification = await Notification.create({
      user: creator,
      message: newMessage,
      link: `/blog/${blogid}`,
      read: false,
      type: "approval",
    });

   

    res.status(200).json(newnotification);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.brn = async (req, res) => {
  const { blogtitle, creator, blogid } = req.body;
  try {
    if (!creator || !blogtitle || !blogid) {
      return res.status(400).json({ msg: "Missing required fields" });
    }
    let newMessage = ` ❌ Your blog ${blogtitle} has been rejected.`;

    const newnotification = await Notification.create({
      user: creator,
      message: newMessage,
      link: `/blog/${blogid}`,
      read: false,
      type: "rejection",
    });

    

    res.status(200).json(newnotification);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.banr = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json("notifications read");
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.newfollower = async (req, res) => {
  const { username, owner, userid } = req.body;
  try {
    if (!username || !owner || !userid) {
      return res.status(400).json({ msg: "Missing required fields" });
    }
    let newMessage = `👥 ${username} started following you`;

    const newnotification = await Notification.create({
      user: owner,
      message: newMessage,
      link: `/f-page/${userid}`,
      read: false,
      type: "newfollower",
    });

    res.status(200).json(newnotification);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.liked = async (req, res) => {
  const { username, owner, blogid, blogtitle } = req.body;
  try {
    if (!username || !owner || !blogid) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    let newMessage = `❤️ ${username} liked your blog ${blogtitle}`;

    const newnotification = await Notification.create({
      user: owner,
      message: newMessage,
      link: `/search?blogId=${blogid}`,
      read: false,
      type: "liked",
    });

 
    res.status(200).json(newnotification);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.commented = async (req, res) => {
  const { username, owner, blogid, blogtitle } = req.body;
  try {
    if (!username || !owner || !blogid) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    let newMessage = `💬 ${username} commented on your blog ${blogtitle}`;

    const newnotification = await Notification.create({
      user: owner,
      message: newMessage,
      link: `/search?blogId=${blogid}&openComment=${"true"}`,
      read: false,
      type: "newcomment",
    });

    res.status(200).json(newnotification);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.getnotification = async (req, res) => {
  try {
    const allnotifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(allnotifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};
