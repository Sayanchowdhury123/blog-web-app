const express = require("express")
const router = express.Router();
const User = require("../models/User")
const Blogs = require("../models/Blogs");
const { authmiddleware, authorizerole } = require("../middleware/auth");
const { createblogs,fetchblogs, deleteblog, editblog, editcontent } = require("../controller/Blogcontorller");

router.get("/",authmiddleware,fetchblogs)
router.post("/create-blog",authmiddleware,authorizerole("writer","editor"),createblogs)
router.put("/:blogid/update-blog",authmiddleware,authorizerole("writer","editor"),editblog)
router.patch("/:blogid/edit-content",authmiddleware,authorizerole("writer","editor"),editcontent)
router.delete("/:blogid/del-blog",authmiddleware,authorizerole("writer","editor"),deleteblog)


module.exports = router;