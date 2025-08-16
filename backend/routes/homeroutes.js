const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const { getallblogs, togglelikes, removelikes, rendercomments, addcomment, editcomments, delcomments, trending } = require("../controller/Homecontroller");
const { authmiddleware } = require("../middleware/auth");
const cloudinary = require("cloudinary").v2;


router.get("/allblogs",getallblogs)
router.get("/trnding",trending)
router.get("/:id/comments",authmiddleware,rendercomments)
router.patch("/:id/add-comment/:userid",authmiddleware,addcomment)
router.patch("/:id/likes/:userid",authmiddleware,togglelikes)
router.patch("/:id/rlikes/:userid",authmiddleware,removelikes)
router.patch("/:id/comments/:userid/edit/:commentid",authmiddleware,editcomments)
router.delete("/:id/comments/:userid/del/:commentid",authmiddleware,delcomments)

module.exports = router;