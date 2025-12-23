const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const { getallblogs, togglelikes, removelikes, rendercomments, addcomment, editcomments, delcomments, trending, popularaauthors, searching, followingpage, renderallcomments } = require("../controller/Homecontroller");
const { authmiddleware } = require("../middleware/auth");
const { trackhistory } = require("../controller/profilecontroller");
const cloudinary = require("cloudinary").v2;
const rateLimit = require("express-rate-limit")
const {ipKeyGenerator} = require("express-rate-limit")

const postlimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => {
    if (req.user && req.user.id) {
      return `user:${req.user.id.toString()}`;
    }

    return ipKeyGenerator(req);
  },
  message: {
    message: "too many post requests",
  },
  standardHeaders: true,
  legacyHeaders: false,
});





const getlimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  keyGenerator: (req) => {
    if (req.user && req.user.id) {
      return `user:${req.user.id.toString()}`;
    }

    return ipKeyGenerator(req);
  },
  message: {
    message: "too many get requests",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const updatelimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => {
    if (req.user && req.user.id) {
      return `user:${req.user.id.toString()}`;
    }

    return ipKeyGenerator(req);
  },
  message: {
    message: "too many update requests",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const deletelimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => {
    if (req.user && req.user.id) {
      return `user:${req.user.id.toString()}`;
    }

    return ipKeyGenerator(req);
  },
  message: {
    message: "too many delete requests",
  },
  standardHeaders: true,
  legacyHeaders: false,
});



 const getLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many GET requests" },
  standardHeaders: true,
  legacyHeaders: false,
});

 const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: "Too many POST requests" },
  standardHeaders: true,
  legacyHeaders: false,
});



router.get("/allblogs",getLimiter,getallblogs)
router.get("/trnding",getLimiter,trending)
router.get("/pa",getLimiter,popularaauthors)
router.post("/search",postLimiter,searching)
router.get("/followingpage",authmiddleware,getlimiter,followingpage)
router.get("/:id/comments",authmiddleware,getlimiter,rendercomments)
router.get("/:id/getallcomments",authmiddleware,getlimiter,renderallcomments)
router.patch("/:id/add-comment/:userid",authmiddleware,updatelimiter,addcomment)
router.patch("/:id/likes/:userid",authmiddleware,updatelimiter,togglelikes)
router.patch("/:id/rlikes/:userid",authmiddleware,updatelimiter,removelikes)
router.patch("/:id/comments/:userid/edit/:commentid",authmiddleware,updatelimiter,editcomments)
router.delete("/:id/comments/:userid/del/:commentid",authmiddleware,deletelimiter,delcomments)

module.exports = router;