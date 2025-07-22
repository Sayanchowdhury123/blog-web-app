const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const cloudinary = require("cloudinary").v2;

exports.createblogs = async (req, res) => {
  try {
    const { title, blogtext, tags } = req.body;
 
    const arr = []
    arr.push(tags)
    
    if (!title || !blogtext || !tags) {
      return res.status(400).json({ msg: "invalid data" });
    }

    if(!Array.isArray(arr)){
        return res.status(400).json({ msg: "tags must be an array" });
    }

    if(!req.user._id){
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
      tags: arr,
      coverimage: result.secure_url,
    });

    res.status(201).json(newblog);
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:"internal server error"})
  }
};

exports.fetchblogs = async (req,res) => {
  try {
    const blogs = await Blogs.find({creator: req.user._id}).populate("creator comments.user")
    res.status(200).json(blogs)
  } catch (error) {
        console.log(error);
    res.status(500).json({msg:"internal server error"})
  }
}
