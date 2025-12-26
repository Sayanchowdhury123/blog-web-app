const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const { options } = require("../routes/authroutes");
const cloudinary = require("cloudinary").v2;

exports.getallblogs = async (req, res) => {
  try {
    const l = parseInt(req.query.l) || 2;
    const s = parseInt(req.query.s) || 0;

    const blogs = await Blogs.find()
      .sort({ createdAt: -1 })
      .populate("creator comments.user");
    if (!blogs) {
      return res.status(400).json({ msg: "Blogs not found" });
    }

    const pag = blogs.slice(s, l + s);

    res.status(200).json({
      blogs: pag,
      h: s + l < blogs.length,
    });
  } catch (error) {
 
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.togglelikes = async (req, res) => {
  const { id, userid } = req.params;
  try {
    if (req.user.id !== userid) {
      return res.status(403).json({ msg: "unauthorized" });
    }
    const blog = await Blogs.findById(id);
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    blog.likes.push(userid);

    await blog.save();
    await blog.populate("likes creator comments.user");

    res.status(200).json(blog);
  } catch (error) {
    
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.removelikes = async (req, res) => {
  const { id, userid } = req.params;
  try {
    if (req.user.id !== userid) {
      return res.status(403).json({ msg: "unauthorized" });
    }
    const blog = await Blogs.findById(id);
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    blog.likes = blog.likes.filter(
      (uid) => uid.toString() !== req.user.id.toString()
    );

    await blog.save();
    await blog.populate("likes creator comments.user");

    res.status(200).json(blog);
  } catch (error) {
    
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.addcomment = async (req, res) => {
  const { userid, id } = req.params;
  const { text } = req.body;
  try {
    if (req.user.id !== userid) {
      return res.status(403).json({ msg: "unauthorized" });
    }

    if (!text) {
      return res.status(404).json({ msg: "invalid text" });
    }

    const blog = await Blogs.findById(id);
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    const comment = {
      user: userid,
      text: text,
    };

    blog.comments.push(comment);

    await blog.save();
    await blog.populate("comments.user");

    const latestcom = blog.comments[blog.comments.length - 1];

    res.status(200).json(latestcom);
  } catch (error) {
    
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.rendercomments = async (req, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 3;
  const skip = parseInt(req.query.skip) || 0;

  try {
    const blog = await Blogs.findById(id).populate("comments.user");
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    const sortedcom = blog.comments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const pag = sortedcom.slice(skip, skip + limit);
    res.status(200).json({
      comments: pag,
      hasmore: skip + limit < sortedcom.length,
    });
  } catch (error) {
   
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.renderallcomments = async (req, res) => {
  const { id } = req.params;


  try {
    const blog = await Blogs.findById(id).populate("comments.user");
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    const sortedcom = blog.comments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );


    res.status(200).json(sortedcom)
  } catch (error) {
    
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.editcomments = async (req, res) => {
  try {
    const { text } = req.body;
    const { id, userid, commentid } = req.params;

    if (req.user.id !== userid) {
      return res.status(403).json({ msg: "unauthorized" });
    }

    if (!text) {
      return res.status(404).json({ msg: "invalid text" });
    }

    const blog = await Blogs.findById(id);
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    const comment = blog.comments.find(
      (c) => c._id.toString() === commentid.toString()
    );

    comment.text = text;

    await blog.save();

    res.status(200).json("comment edited");
  } catch (error) {
    
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.delcomments = async (req, res) => {
  try {
    const { id, userid, commentid } = req.params;

    if (req.user.id !== userid) {
      return res.status(403).json({ msg: "unauthorized" });
    }

    const blog = await Blogs.findById(id);
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    blog.comments = blog.comments.filter(
      (c) => c._id.toString() !== commentid.toString()
    );

    await blog.save();

    res.status(200).json("comment edited");
  } catch (error) {
    
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.trending = async (req, res) => {
  try {
    const blogs = await Blogs.find().populate("creator");

    if (blogs.length === 0) {
      return res.status(400).json({ msg: "Blogs not found" });
    }
    const approved = blogs.filter((h) => h.approval === true).slice(0, 5);

    const tscore = (b) => {
      const now = Date.now();
      const ageindays = (now - new Date(b.createdAt)) / (1000 * 60 * 60 * 24);
      const receny = 1 / (1 + ageindays);
      const enagement =
        b.views?.length + b.views?.length * 2 + b.views?.length * 3;

      return enagement * receny;
    };

    const trending = approved.sort((a, b) => tscore(b) - tscore(a));

    res.status(200).json(trending);
  } catch (error) {
   
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.popularaauthors = async (req, res) => {
  try {
    const blogs = await Blogs.find().populate("creator");

    if (blogs.length === 0) {
      return res.status(400).json({ msg: "Blogs not found" });
    }
    const approved = blogs.filter((h) => h.approval === true).slice(0, 5);

    const tscore = (b) => {
      const now = Date.now();
      const ageindays = (now - new Date(b.createdAt)) / (1000 * 60 * 60 * 24);
      const receny = 1 / (1 + ageindays);
      const enagement =
        b.views?.length + b.views?.length * 2 + b.views?.length * 3;

      return enagement * receny;
    };

    const trending = approved.sort((a, b) => tscore(b) - tscore(a));

    res.status(200).json(trending);
  } catch (error) {

    res.status(500).json({ msg: "internal server error" });
  }
};

exports.searching = async (req, res) => {
  const { searchtext } = req.body;


  try {
    if (!searchtext) {
      return res.status(404).json({ msg: "please provide search text" });
    }

    const blogs = await Blogs.find({
      $or: [
        { title: { $regex: searchtext, $options: "i" } },
        { tags: { $in: [searchtext] } },
      ],
    })
      .populate({
        path: "creator",
        match: { name: { $regex: searchtext, $options: "i" } },
      })
      .populate("comments.user");

    const filterblogs = blogs.filter((b) => b.creator !== null);

    res.status(200).json(filterblogs);
  } catch (error) {
 
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.followingpage = async (req, res) => {
  try {
    const l = parseInt(req.query.l) || 2;
    const s = parseInt(req.query.s) || 0;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json("user not found");
    }

    const following = user.following;
    

    
      const blogs = await Blogs.find({
        creator: { $in: following },
      }).sort({ createdAt: -1 }).populate("creator comments.user");

      if (!blogs) {
        return res.status(400).json("blogs not found");
      }

      

      const pag = blogs.slice(s, l + s);

   

      res.status(200).json({
        blogs: pag,
        h: s + l < blogs.length,
      });
    
  } catch (error) {
   
    res.status(500).json({ msg: "internal server error" });
  }
};
