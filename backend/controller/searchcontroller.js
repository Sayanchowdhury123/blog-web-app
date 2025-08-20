const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const bcrypts = require("bcryptjs");
const Blogs = require("../models/Blogs");


exports.searchblog = async (req,res) => {
    const {st} = req.query;
    try {
        if(!st || st.trim() === ""){
            return res.status(400).json("invalid query")
        }

        const authors = await User.find({
            name: {$regex: st, $options: "i"}
        }).select("_id")
        const authorids = authors.map((a) => a._id)

        const blogs = await Blogs.find({
            $or:[
              {title: {$regex: st, $options: "i"}} ,
               {tags: { $elemMatch: {$regex: st, $options: "i"}} },
               {blogtext: {$regex: st, $options: "i"}},
               {creator: {$in: authorids}},
            ]
        }).populate("creator comments.user").sort({createdAt: -1})

        res.status(200).json({
            results: blogs,
            count: blogs.length
        })
    } catch (error) {
         console.log(error);
    res.status(500).json({ msg: "internal server error" });
    }
}

exports.allblogs = async (req,res) => {
    try {
        const blogs = await Blogs.find().populate("creator comments.user")
        res.json(blogs)
    } catch (error) {
        console.log(error);
    res.status(500).json({ msg: "internal server error" });
    }
}