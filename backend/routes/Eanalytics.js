const express = require("express")
const router = express.Router();
const User = require("../models/User")
const Blogs = require("../models/Blogs");
const { authmiddleware, authorizerole } = require("../middleware/auth");
const { blogreviewed, blogedited, editexit, getApprovalRate, geteditedbloginfo } = require("../controller/eacontroller");

router.get("/edit-info",authmiddleware,authorizerole("editor"),geteditedbloginfo)
router.get("/approval-rate",authmiddleware,authorizerole("editor"),getApprovalRate)
router.post("/reviewed",authmiddleware,authorizerole("editor"),blogreviewed)
router.post("/edited",authmiddleware,authorizerole("editor"),blogedited)
router.patch("/exit-edit",authmiddleware,authorizerole("editor"),editexit)


module.exports = router;