const express = require("express");
const { authmiddleware } = require("../middleware/auth");
const { following, getuserinfo, getfollowerinfo, getfollowinginfo } = require("../controller/Followercontroller");
const { blogapprovednotify, getnotification, banr } = require("../controller/notificationcontroller");
const router = express.Router();



router.get("/get-notification",authmiddleware,getnotification)
router.post("/ban",authmiddleware,blogapprovednotify)
router.put("/banr",authmiddleware,banr)

module.exports = router;