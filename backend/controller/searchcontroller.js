const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const bcrypts = require("bcryptjs");
const Blogs = require("../models/Blogs");

exports.searchblog = async (req, res) => {
  const { st } = req.query;
  try {
    if (!st || st.trim() === "") {
      return res.status(400).json("invalid query");
    }

    const authors = await User.find({
      name: { $regex: st, $options: "i" },
    }).select("_id");
    const authorids = authors.map((a) => a._id);

    const quert = st
      ? {
          $or: [
            { title: { $regex: st, $options: "i" } },
            { tags: { $elemMatch: { $regex: st, $options: "i" } } },
            { blogtext: { $regex: st, $options: "i" } },
            { creator: { $in: authorids } },
          ],
        }
      : {};

    const blogs = await Blogs.find(quert).populate("creator comments.user");

    res.status(200).json(blogs);
  } catch (error) {
    
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.allblogs = async (req, res) => {
  try {
    const blogs = await Blogs.find().populate("creator comments.user");
    res.json(blogs);
  } catch (error) {
    
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.sorting = async (req, res) => {
  const { sv } = req.query;

  try {
    if (!sv || sv.trim() === "") {
      return res.status(400).json("invalid query");
    }

    if (sv === "newest") {
      const blogs = await Blogs.find()
        .sort({ createdAt: -1 })
        .populate("creator comments.user");
      return res.status(200).json(blogs);
    } else if (sv === "popularity") {
      const blogs = await Blogs.find().populate("creator comments.user");
      const tscore = (b) => {
        const enagement =
          b.views?.length + b.views?.length * 2 + b.views?.length * 3;
        return enagement;
      };

      const popularblogs = blogs.sort((a, b) => tscore(b) - tscore(a));
      return res.status(200).json(popularblogs);
    } else if (sv === "oldest") {
      const blogs = await Blogs.find()
        .sort({ createdAt: 1 })
        .populate("creator comments.user");
      return res.status(200).json(blogs);
    } else if (sv === "all") {
      const blogs = await Blogs.find().populate("creator comments.user");
      return res.status(200).json(blogs);
    } else {
      return res.status(200).json({ msg: "invalid sorting option" });
    }
  } catch (error) {
    
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.addsh = async (req, res) => {
  const { searchtext } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json("unauthorized");
    }

    if (!searchtext) {
      return res.status(400).json("invalid data");
    }

    if (
      !user.sh.some((item) => item.toLowerCase() === searchtext.toLowerCase())
    ) {
      user.sh.unshift(searchtext);
      if (user.sh.length > 10) {
        user.sh.pop();
      }
    } else {
      return res.status(200).json("already added");
    }

    await user.save();

    res.status(200).json(user.sh);
  } catch (error) {
    
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.getsh = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json("unauthorized");
    }

    const searchhis = user.sh.slice(0, 5);

    res.status(200).json(searchhis);
  } catch (error) {
    
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.filterblog = async (req, res) => {
  try {
    const { creators, tags, editorpicks } = req.query;

  

    const filters = {};

    if (tags) {
      filters.tags = { $in: tags.split(",") };
    }

    if (editorpicks !== undefined) {
      filters.ep = editorpicks === "true";
    }

    if (creators) {
      filters.creator = { $in: creators.split(",") };
    }

    const blogs = await Blogs.find(filters).sort({ createdAt: -1 }).populate("creator comments.user");

    res.status(200).json(blogs)
    
  } catch (error) {
    
    res.status(500).json({ msg: "internal server error" });
  }
};
