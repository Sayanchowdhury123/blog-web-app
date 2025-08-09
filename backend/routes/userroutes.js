const express = require("express");
const { authmiddleware } = require("../middleware/auth");
const { getprofile, postpic, updateprofile, delprofile, saveblog, getsavedblogs } = require("../controller/profilecontroller");
const router = express.Router();

router.get("/:id",authmiddleware,getprofile)
router.get("/:userid/savedblogs",authmiddleware,getsavedblogs)
router.patch("/:blogid/togglesave/:userid",authmiddleware,saveblog)
router.patch("/:id/updateprofile",authmiddleware,updateprofile)
router.delete("/:id/del",authmiddleware,delprofile)

module.exports = router;