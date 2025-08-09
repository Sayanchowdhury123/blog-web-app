const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const bcrypts = require("bcryptjs");

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
  const page = (req.query.page) || 1;
  const limit = (req.query.limit) || 2;
  const skip = (page -1) * limit;
  
  try {

      if (req.user.id !== userid) {
      return res.status(400).json({ msg: "unauthorized" });
    }
    const user = await User.findById(userid).populate({
      path: "savedblogs",
    
    })

    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    res.status(200).json(user.savedblogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};
