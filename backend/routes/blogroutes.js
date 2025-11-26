const express = require("express")
const router = express.Router();
const User = require("../models/User")
const Blogs = require("../models/Blogs");
const { authmiddleware, authorizerole } = require("../middleware/auth");
const { createblogs,fetchblogs, deleteblog, editblog, editcontent, fetchblog, addview, selectusers, startcollab, endcollab, saveyjsupadte } = require("../controller/Blogcontorller");

router.get("/",authmiddleware,authorizerole("writer","editor"),fetchblogs)
router.get("/get-users",authmiddleware,authorizerole("writer","editor"),selectusers)
router.get("/:blogid",authmiddleware,fetchblog)
router.post("/saveyjs/:id",authmiddleware,saveyjsupadte)
router.post("/create-blog",authmiddleware,authorizerole("writer","editor"),createblogs)
router.put("/:blogid/update-blog",authmiddleware,authorizerole("writer","editor"),editblog)
router.patch("/:blogid/edit-content",authmiddleware,authorizerole("writer","editor"),editcontent)
router.patch("/:blogid/start-collab",authmiddleware,authorizerole("writer","editor"),startcollab)
router.patch("/:blogid/end-collab",authmiddleware,authorizerole("writer","editor"),endcollab)
router.patch("/:blogid/add-view/:userid",authmiddleware,addview)
router.delete("/:blogid/del-blog",authmiddleware,authorizerole("writer","editor"),deleteblog)


module.exports = router;