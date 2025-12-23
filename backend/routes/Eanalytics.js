const express = require("express")
const router = express.Router();
const User = require("../models/User")
const Blogs = require("../models/Blogs");
const { authmiddleware, authorizerole } = require("../middleware/auth");
const { blogreviewed, blogedited, editexit, getApprovalRate, geteditedbloginfo } = require("../controller/eacontroller");
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

router.get("/edit-info",authmiddleware,getlimiter,authorizerole("editor"),geteditedbloginfo)
router.get("/approval-rate",authmiddleware,getlimiter,authorizerole("editor"),getApprovalRate)
router.post("/reviewed",authmiddleware,postlimiter,authorizerole("editor"),blogreviewed)
router.post("/edited",authmiddleware,postlimiter,authorizerole("editor"),blogedited)
router.patch("/exit-edit",authmiddleware,upadtelimiter,authorizerole("editor"),editexit)


module.exports = router;