const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");

exports.fetchblogall = async (req, res) => {
  try {
    const blogs = await Blogs.find()
      .sort({ createdAt: -1 })
      .populate("creator comments.user");
    if (!blogs) {
      return res.status(400).json("no blogs found");
    }
    res.status(200).json(blogs);
  } catch (error) {
 
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.changeapproval = async (req, res) => {
  const { blogid } = req.params;
  try {
    const b = await Blogs.findById(blogid).populate("creator comments.user");
    if (!b) {
      return res.status(400).json({ msg: "blog not found" });
    }

    b.approval = !b.approval;
    await b.save();

    res.status(200).json(b);
  } catch (error) {
    
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.epblogs = async (req, res) => {
  const { blogid } = req.params;
  try {
    const b = await Blogs.findById(blogid);
    if (!b) {
      return res.status(400).json({ msg: "blog not found" });
    }

    if (b.ep === true) {
      b.ep = false;
    } else if (b.ep === false) {
      b.ep = true;
    }
    await b.save();

    res.status(200).json(b);
  } catch (error) {
 
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.fetchepblogs = async (req, res) => {
  try {
    const blogs = await Blogs.find({ ep: true }).populate(
      "creator comments.user"
    );
    if (!blogs) {
      return res.status(400).json({ msg: "blogs not found" });
    }
    const approved = blogs.filter((h) => h.approval === true)

    const tscore = (b) => {
      const now = Date.now();
      const ageindays = (now - new Date(b.createdAt)) / (1000 * 60 * 60 * 24);
      const receny = 1 / (1 + ageindays);
      const enagement = b.views?.length + b.views?.length * 2 + b.views?.length * 3;

      return enagement * receny;
    };

    const editorpicks = approved.sort((a, b) => tscore(b) - tscore(a)).slice(0,3)

    res.status(200).json(editorpicks)
  } catch (error) {
     
    res.status(500).json({ msg: "internal server error" });
  }
};

