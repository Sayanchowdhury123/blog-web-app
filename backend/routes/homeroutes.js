const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const { getallblogs, togglelikes, removelikes } = require("../controller/Homecontroller");
const { authmiddleware } = require("../middleware/auth");
const cloudinary = require("cloudinary").v2;


router.get("/allblogs",getallblogs)
router.patch("/:id/likes/:userid",authmiddleware,togglelikes)
router.patch("/:id/rlikes/:userid",authmiddleware,removelikes)

module.exports = router;