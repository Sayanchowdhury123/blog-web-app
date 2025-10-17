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

exports.banr = async (req, res) => {
  const { nid } = req.body;
  try {
    if (!nid) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const n = await Notification.findById(nid);
    

    n.read = true;
    await n.save();
    res.status(200).json("notification read");
  } catch (error) {
      console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};


exports.getnotification = async (req,res) => {
    try {
        const allnotifications = await Notification.find({
         user: req.user.id
        }).sort({ createdAt: -1 });

          res.status(200).json(allnotifications)
    } catch (error) {
          console.log(error);
    res.status(500).json({ msg: "internal server error" });
    }
}