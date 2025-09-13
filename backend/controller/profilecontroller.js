const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const bcrypts = require("bcryptjs");
const Blogs = require("../models/Blogs");
const Editorps = require("../models/Editorpick");
const mongoose = require("mongoose");

exports.getprofile = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.id !== id) {
      return res.status(400).json({ msg: "unauthorized" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.updateprofile = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.id !== id) {
      return res.status(400).json({ msg: "unauthorized" });
    }

    const { name } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    if (name) user.name = name;

    const file = req.files?.profilepic;

    let result;
    if (file) {
      try {
        if (user.pid) {
          await cloudinary.uploader.destroy(user.pid, {
            resource_type: "image",
          });
        }

        result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "profilepics",
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "image upload error" });
      }
    }
    user.profilepic = result?.secure_url || user.profilepic;
    user.pid = result?.public_id || user.pid;

    await user.save();

    console.log(user);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.delprofile = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.id !== id) {
      return res.status(400).json({ msg: "unauthorized" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.saveblog = async (req, res) => {
  const { blogid, userid } = req.params;
  try {
    if (req.user.id !== userid) {
      return res.status(400).json({ msg: "unauthorized" });
    }

    const user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    const alreadysaved = user.savedblogs.some(
      (id) => id.toString() === blogid.toString()
    );

    if (alreadysaved) {
      user.savedblogs = user.savedblogs.filter(
        (s) => s.toString() !== blogid.toString()
      );
    } else {
      user.savedblogs.push(blogid);
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.getsavedblogs = async (req, res) => {
  const { userid } = req.params;
  const page = req.query.page || 1;
  const limit = req.query.limit || 2;
  const skip = (page - 1) * limit;

  try {
    if (req.user.id !== userid) {
      return res.status(400).json({ msg: "unauthorized" });
    }
    const user = await User.findById(userid).populate({
      path: "savedblogs",
    });

    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    res.status(200).json(user.savedblogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.trackhistory = async (req, res) => {
  const { blogid, tags } = req.body;
  const { userid } = req.params;
  try {
    const user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    if (tags === undefined) {
      return res.status(400).json({ msg: "need tags" });
    }

    const history = {
      blogid: blogid,
      tags: tags,
    };

    const alreadyread = user.readinghistory.some((r) =>
      r.blogid.equals(blogid)
    );
    if (alreadyread) {
      return res.status(200).json("already saved");
    } else {
      user.readinghistory.push(history);
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.getrecommdations = async (req, res) => {
  const { userid } = req.params;
  try {
    const user = await User.findById(userid).populate("readinghistory.blogid");
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    let tagcount = {};
    user.readinghistory.forEach((r) => {
      r.blogid.tags.forEach((t) => {
        tagcount[t] = (tagcount[t] || 0) + 1;
      });
    });

    const topTags = Object.keys(tagcount)
      .sort((a, b) => tagcount[b] - tagcount[a])
      .slice(0, 3);

    const alreadyReadIds = user.readinghistory.map(
      (r) => new mongoose.Types.ObjectId(r.blogid._id)
    );

    const recommended = await Blogs.find({
      tags: { $in: topTags },
      _id: { $nin: alreadyReadIds },
    })
      .limit(3)
      .populate("creator");

    res.status(200).json(recommended);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.editorpicks = async (req, res) => {
  const { blogid } = req.params;
  const { userid } = req.params;
  try {
    if (req.user.id !== userid) {
      return res.status(400).json({ msg: "unauthorized" });
    }

    let existingep = await Editorps.findOne();

    if (!existingep) {
      existingep = new Editorps({
        editorpicks: [],
      });
    }
    if (!existingep.editorpicks?.includes(blogid.toString())) {
      existingep.editorpicks?.push(blogid);
      await existingep.save();
    }

    res.status(200).json(existingep);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.geteditorpicks = async (req, res) => {
  try {
    const eps = await Editorps.find()
      .populate("editorpicks")
      .sort({ createdAt: -1 })
      .limit(5);
    if (!eps) {
      return res.status(400).json({ msg: "not found" });
    }
    res.status(200).json(eps);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.editemail = async (req, res) => {

  const { pass, newemail } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json("user not found");
    }

    const ismatch = bcrypts.compare(pass, user.password);
    if (!ismatch) {
      return res.status(400).json({ message: "invalid crediatials" });
    }

  
        
          user.email = newemail;
          await user.save()
          res.status(200).json("email updated")
    
  } catch (error) {
        console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};


exports.editpassword = async (req, res) => {
  const { oldpass, newpass } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json("user not found");
    }

    const ismatch = bcrypts.compare(oldpass, user.password);
    if (!ismatch) {
      return res.status(400).json({ message: "invalid crediatials" });
    }
   
     const salt = await bcrypts.genSalt(10);
    user.password = await bcrypts.hash(newpass, salt);
     
    await user.save()
        
    res.status(200).json("password updated")
  } catch (error) {
        console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.delp = async (req, res) => {
  const { p } = req.params;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json("user not found");
    }

    const ismatch = bcrypts.compare(p, user.password);
    if (!ismatch) {
      return res.status(400).json({ message: "invalid crediatials" });
    }
     if (user.pid) {
          await cloudinary.uploader.destroy(user.pid, {
            resource_type: "image",
          });
        }
    await Blogs.deleteMany({creator: req.user.id})
   await User.findByIdAndDelete(req.user.id)
   
     
    res.status(200).json("account deleted")
  } catch (error) {
        console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};




