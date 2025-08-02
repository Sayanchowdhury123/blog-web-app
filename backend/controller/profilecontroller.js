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

    const { name, email } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;

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
    user.profilepic = result.secure_url;
    user.pid = result.public_id;

    const updateduser = await user.save();

    res.status(200).json(updateduser);
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
