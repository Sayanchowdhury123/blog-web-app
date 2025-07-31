const express = require("express")
const router = express.Router();
const User = require("../models/User")
const Blogs = require("../models/Blogs");
const { authmiddleware, authorizerole } = require("../middleware/auth");
const { fetchblogall, changeapproval } = require("../controller/editcotroller");


router.get("/fetch-all",authmiddleware,authorizerole("editor"),fetchblogall)
router.patch("/:blogid/approval",authmiddleware,authorizerole("editor"),changeapproval)

module.exports = router;