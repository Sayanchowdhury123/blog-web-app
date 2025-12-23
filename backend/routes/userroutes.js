const express = require("express");
const { authmiddleware, authorizerole } = require("../middleware/auth");
const { getprofile, postpic, updateprofile, delprofile, saveblog, getsavedblogs, trackhistory, getrecommdations, editorpicks, geteditorpicks, editemail, editpassword, delp } = require("../controller/profilecontroller");
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

router.get("/editorpicks",getLimiter,geteditorpicks)
router.get("/:id",authmiddleware,getLimiter,getprofile)
router.get("/:userid/recom",authmiddleware,getlimiter,getrecommdations)
router.get("/:userid/savedblogs",authmiddleware,getlimiter,getsavedblogs)
router.post("/:blogid/ep/:userid",authmiddleware,postlimiter,authorizerole("editor"),editorpicks)
router.patch("/edit-email",authmiddleware,updatelimiter,editemail)
router.patch("/edit-pass",authmiddleware,updatelimiter,editpassword)
router.patch("/:blogid/togglesave/:userid",updatelimiter,authmiddleware,saveblog)
router.patch("/:userid/readh",authmiddleware,updatelimiter,trackhistory)
router.patch("/:id/updateprofile",authmiddleware,updatelimiter,updateprofile)
router.delete("/delp/:p",authmiddleware,deletelimiter,delp)

module.exports = router;