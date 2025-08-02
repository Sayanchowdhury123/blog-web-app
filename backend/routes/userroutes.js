const express = require("express");
const { authmiddleware } = require("../middleware/auth");
const { getprofile, postpic, updateprofile, delprofile } = require("../controller/profilecontroller");
const router = express.Router();

router.get("/:id",authmiddleware,getprofile)
router.patch("/:id/updateprofile",authmiddleware,updateprofile)
router.delete("/:id/del",authmiddleware,delprofile)

module.exports = router;