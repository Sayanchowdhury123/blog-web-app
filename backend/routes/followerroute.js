const express = require("express");
const { authmiddleware } = require("../middleware/auth");
const { following, getuserinfo, getfollowerinfo, getfollowinginfo } = require("../controller/Followercontroller");
const router = express.Router();

router.get("/:userid",authmiddleware,getuserinfo)
router.get("/:followingid",authmiddleware,getfollowinginfo)
router.get("/:followerid/followers",authmiddleware,getfollowerinfo)
router.patch("/:fid/uf/:uid",authmiddleware,following)

module.exports = router;