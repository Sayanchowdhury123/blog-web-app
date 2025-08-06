const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const { getallblogs } = require("../controller/Homecontroller");
const { authmiddleware } = require("../middleware/auth");
const cloudinary = require("cloudinary").v2;


router.get("/allblogs",authmiddleware,getallblogs)

module.exports = router;