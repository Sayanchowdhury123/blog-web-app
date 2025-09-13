const express = require("express");
const { authmiddleware, authorizerole } = require("../middleware/auth");
const { getprofile, postpic, updateprofile, delprofile, saveblog, getsavedblogs, trackhistory, getrecommdations, editorpicks, geteditorpicks, editemail, editpassword, delp } = require("../controller/profilecontroller");
const router = express.Router();

router.get("/editorpicks",geteditorpicks)
router.get("/:id",authmiddleware,getprofile)
router.get("/:userid/recom",authmiddleware,getrecommdations)
router.get("/:userid/savedblogs",authmiddleware,getsavedblogs)
router.post("/:blogid/ep/:userid",authmiddleware,authorizerole("editor"),editorpicks)
router.patch("/edit-email",authmiddleware,editemail)
router.patch("/edit-pass",authmiddleware,editpassword)
router.patch("/:blogid/togglesave/:userid",authmiddleware,saveblog)
router.patch("/:userid/readh",authmiddleware,trackhistory)
router.patch("/:id/updateprofile",authmiddleware,updateprofile)
router.delete("/delp/:p",authmiddleware,delp)

module.exports = router;