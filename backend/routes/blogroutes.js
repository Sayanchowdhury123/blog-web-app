const express = require("express")
const router = express.Router();
const User = require("../models/User")
const Blogs = require("../models/Blogs");
const { authmiddleware, authorizerole } = require("../middleware/auth");
const { createblogs,fetchblogs, deleteblog, editblog, editcontent, fetchblog } = require("../controller/Blogcontorller");

router.get("/",authmiddleware,authorizerole("writer","editor"),fetchblogs)
router.get("/:blogid",authmiddleware,fetchblog)
router.post("/create-blog",authmiddleware,authorizerole("writer","editor"),createblogs)
router.put("/:blogid/update-blog",authmiddleware,authorizerole("writer","editor"),editblog)
router.patch("/:blogid/edit-content",authmiddleware,authorizerole("writer","editor"),editcontent)
router.delete("/:blogid/del-blog",authmiddleware,authorizerole("writer","editor"),deleteblog)


module.exports = router;