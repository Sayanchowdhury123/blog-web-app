const express = require("express");
const { authmiddleware } = require("../middleware/auth");
const { getprofile, postpic, updateprofile, delprofile, saveblog, getsavedblogs, trackhistory, getrecommdations } = require("../controller/profilecontroller");
const { searchblog, allblogs } = require("../controller/searchcontroller");
const router = express.Router();

router.get("/allblogs",allblogs)
router.get("/search",searchblog)

module.exports = router;