const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const cloudinary = require("cloudinary").v2;

exports.getallblogs = async () => {
    try {
        const blogs = await Blogs.find().sort({createdAt: -1}).populate("creator comments.user")
        if(!blogs){
             return res.status(400).json({ msg: "Blogs not found" });
        }
    } catch (error) {
          console.log(error);
    res.status(500).json({ msg: "internal server error" });
    }
}


