const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const cloudinary = require("cloudinary").v2;

exports.getallblogs = async (req, res) => {
  try {
    const blogs = await Blogs.find()
      .sort({ createdAt: -1 })
      .populate("creator comments.user");
    if (!blogs) {
      return res.status(400).json({ msg: "Blogs not found" });
    }
    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.togglelikes = async (req, res) => {
  const { id, userid } = req.params;
  try {
    if (req.user.id !== userid) {
      return res.status(403).json({ msg: "unauthorized" });
    }
    const blog = await Blogs.findById(id)
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }
   
  
   
     blog.likes.push(userid);
   
  

    await blog.save();
    await blog.populate("likes creator comments.user");

    res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.removelikes = async (req, res) => {
  const { id, userid } = req.params;
  try {
    if (req.user.id !== userid) {
      return res.status(403).json({ msg: "unauthorized" });
    }
    const blog = await Blogs.findById(id)
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }
   
  
    blog.likes = blog.likes.filter((uid) => uid.toString() !== req.user.id.toString())

    await blog.save();
    await blog.populate("likes creator comments.user")

    res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};



