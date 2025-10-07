const express = require("express")
const router = express.Router();
const User = require("../models/User")
const Blogs = require("../models/Blogs");
const { authmiddleware, authorizerole } = require("../middleware/auth");
const { onlywrittenbywriter, popularblogs, trackview, traceentry, traceexit } = require("../controller/writercontroller");


router.get("/",authmiddleware,authorizerole("writer"),onlywrittenbywriter)
router.get("/popular",authmiddleware,authorizerole("writer"),popularblogs)
router.post("/track-view/:postid",authmiddleware,authorizerole("writer","editor"),trackview)
router.post("/entry/:postid",authmiddleware,authorizerole("writer","editor"),traceentry)
router.post("/exit/:entryid",traceexit)

module.exports = router;