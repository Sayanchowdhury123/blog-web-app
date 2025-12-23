const express = require("express");
const { authmiddleware } = require("../middleware/auth");
const { following, getuserinfo, getfollowerinfo, getfollowinginfo } = require("../controller/Followercontroller");
const router = express.Router();
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

const upadtelimiter = rateLimit({
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

router.get("/:userid",authmiddleware,getlimiter,getuserinfo)
router.get("/:followingid",authmiddleware,getlimiter,getfollowinginfo)
router.get("/:followerid/followers",authmiddleware,getlimiter,getfollowerinfo)
router.patch("/:fid/uf/:uid",authmiddleware,upadtelimiter,following)

module.exports = router;