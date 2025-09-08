const express = require("express");
const { authmiddleware } = require("../middleware/auth");
const { getprofile, postpic, updateprofile, delprofile, saveblog, getsavedblogs, trackhistory, getrecommdations } = require("../controller/profilecontroller");
const { searchblog, allblogs, sorting, getsh, addsh, filterblog } = require("../controller/searchcontroller");
const router = express.Router();

router.get("/allblogs",allblogs)
router.get("/search",searchblog)
router.get("/sorting",sorting)
router.get("/filter",filterblog)
router.get("/getsh",authmiddleware,getsh)
router.patch("/addsh",authmiddleware,addsh)

module.exports = router;