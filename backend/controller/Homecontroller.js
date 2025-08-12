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

exports.addcomment = async (req,res) => {
   const {userid,id} = req.params;
   const {text} = req.body;
  try {
     if (req.user.id !== userid) {
      return res.status(403).json({ msg: "unauthorized" });
    }

     if (!text) {
      return res.status(404).json({ msg: "invalid text" });
    }

      const blog = await Blogs.findById(id)
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

     const comment = {
      user: userid,
      text:text,
    
     }

     blog.comments.push(comment)

     await blog.save()
     await blog.populate("comments.user")

     const latestcom = blog.comments[blog.comments.length - 1]


     res.status(200).json(latestcom)
     console.log(latestcom);
    

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
}


exports.rendercomments = async (req,res) => {
  const {id} = req.params;
  const limit = parseInt(req.query.limit) || 3 ;
  const skip = parseInt(req.query.skip) || 0 ;
  
  try {
     const blog = await Blogs.findById(id).populate("comments.user")
     if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

   const sortedcom = blog.comments.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))

   const pag = sortedcom.slice(skip,skip + limit)
    res.status(200).json({
      comments: pag,
      hasmore: skip + limit < sortedcom.length
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
}



