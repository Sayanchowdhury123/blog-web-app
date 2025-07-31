const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");


exports.fetchblogall = async (req,res) => {
    try {
        const blogs = await Blogs.find({}).populate("creator comments.user")
        if(!blogs){
            return res.status(400).json("no blogs found")
        }
        res.status(200).json(blogs)
    } catch (error) {
         console.log(error);
    res.status(500).json({ msg: "internal server error" });
    }
}

exports.changeapproval = async (req,res) => {
     const { blogid } = req.params;
    try {
         const b = await Blogs.findById(blogid).populate("creator comments.user")
              if (!b) {
              return res.status(400).json({ msg: "blog not found" });
            }

          b.approval = !b.approval;
          await b.save();

          res.status(200).json(b)

    } catch (error) {
         console.log(error);
    res.status(500).json({ msg: "internal server error" });
    }
}