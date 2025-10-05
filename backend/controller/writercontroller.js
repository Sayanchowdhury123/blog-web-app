const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const geoip = require("geoip-lite")
const uap = require('ua-parser-js');


exports.onlywrittenbywriter = async (req,res) => {
    try {
        
        if(req.user.id) {
            const blogs = await Blogs.find({
            creator: req.user.id
        })

       res.status(200).json(blogs)
        }
    
    } catch (error) {
        console.log(error);
    }
}

exports.popularblogs = async (req, res) => {
  try {
    const blogs = await Blogs.find({
        creator: req.user.id
    });

    if (blogs.length === 0) {
      return res.status(400).json({ msg: "Blogs not found" });
    }
    const approved = blogs.filter((h) => h.approval === true).slice(0, 5);

    const tscore = (b) => {
    
      const enagement =
        b.views?.length + b.views?.length * 2 + b.views?.length * 3;

      return enagement ;
    };

    const trending = approved.sort((a, b) => tscore(b) - tscore(a));

    res.status(200).json(trending);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.trackuser = async (req,res) => {
 try {
    
 } catch (error) {
    
 }   
}

