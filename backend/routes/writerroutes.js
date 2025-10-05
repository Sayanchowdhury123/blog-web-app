const express = require("express")
const router = express.Router();
const User = require("../models/User")
const Blogs = require("../models/Blogs");
const { authmiddleware, authorizerole } = require("../middleware/auth");
const { onlywrittenbywriter, popularblogs } = require("../controller/writercontroller");


router.get("/",authmiddleware,authorizerole("writer"),onlywrittenbywriter)
router.get("/popular",authmiddleware,authorizerole("writer"),popularblogs)
module.exports = router;