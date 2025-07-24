const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const cloudinary = require("cloudinary").v2;

exports.createblogs = async (req, res) => {
  try {
    const { title, blogtext } = req.body;

    const tags = JSON.parse(req.body.tags)


    if (!title || !blogtext || !tags) {
      return res.status(400).json({ msg: "invalid data" });
    }

    if (!Array.isArray(tags)) {
      return res.status(400).json({ msg: "tags must be an array" });
    }

    if (!req.user._id) {
      return res.status(400).json({ msg: "unauthorized" });
    }

    if (!req.files || !req.files.coverimage) {
      return res.status(400).json({ msg: "no file uploaded" });
    }

    const file = req.files.coverimage;

    let result;
    try {
      result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "coverimages",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "image upload error" });
    }

    const newblog = await Blogs.create({
      creator: req.user._id,
      title: title,
      blogtext: blogtext,
      tags: tags,
      coverimage: result.secure_url,
      cid: result.public_id,
    });

    res.status(201).json(newblog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.fetchblogs = async (req, res) => {
  try {
    const blogs = await Blogs.find({ creator: req.user._id }).populate(
      "creator comments.user"
    );
    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.editblog = async (req, res) => {
  const { blogid } = req.params;
  try {
    const { title, blogtext } = req.body;
     const tags = JSON.parse(req.body.tags)
     
    const b = await Blogs.findById(blogid);
    
    if (!b) {
      return res.status(400).json({ msg: "blog not found" });
    }

    
    const file = req.files?.coverimage;


    let result;
    if (file) {
      try {
        if (b.cid) {
          await cloudinary.uploader.destroy(b.cid, {
            resource_type: "coverimages",
          });
        }

        result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "coverimages",
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "image upload error" });
      }
    }

    b.blogtext = blogtext || b.blogtext;
    b.title = title || b.title;
    b.tags = tags || b.tags;
    b.cid = result?.public_id || b.cid;
    b.coverimage = result?.secure_url || b.coverimage;

    await b.save();

    res.status(200).json("Blog updated")

  } catch (error) {
        console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.deleteblog = async (req, res) => {
  const { blogid } = req.params;
  try {
    const b = await Blogs.findById(blogid);
    if (b.cid) {
      await cloudinary.uploader.destroy(b.cid, {
        resource_type: "coverimages",
      });
    }
    const del = await Blogs.findByIdAndDelete(blogid);
    res.status(200).json(blogid);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};
