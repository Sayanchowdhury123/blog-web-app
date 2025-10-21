const express = require("express");
const { authmiddleware } = require("../middleware/auth");
const { blogapprovednotify, getnotification, banr, brn, newfollower } = require("../controller/notificationcontroller");
const router = express.Router();



router.get("/get-notification",authmiddleware,getnotification)
router.post("/ban",authmiddleware,blogapprovednotify)
router.post("/brn",authmiddleware,brn)
router.post("/new-follower",authmiddleware,newfollower)
router.put("/banr",authmiddleware,banr)

module.exports = router;