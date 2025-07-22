const express = require("express")
const router = express.Router();
const User = require("../models/User")
const Blogs = require("../models/Blogs");
const { authmiddleware, authorizerole } = require("../middleware/auth");
const { createblogs,fetchblogs } = require("../controller/Blogcontorller");

router.get("/",authmiddleware,fetchblogs)
router.post("/create-blog",authmiddleware,authorizerole("writer","editor"),createblogs)

module.exports = router;