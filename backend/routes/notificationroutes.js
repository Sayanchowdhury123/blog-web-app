const express = require("express");
const { authmiddleware } = require("../middleware/auth");
const { blogapprovednotify, getnotification, banr, brn, newfollower, liked, commented } = require("../controller/notificationcontroller");
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



router.get("/get-notification",authmiddleware,getlimiter,getnotification)
router.post("/ban",authmiddleware,postlimiter,blogapprovednotify)
router.post("/brn",authmiddleware,postlimiter,brn)
router.post("/new-follower",authmiddleware,postlimiter,newfollower)
router.post("/bln",authmiddleware,postlimiter,liked)
router.post("/commented",authmiddleware,postlimiter,commented)
router.put("/banr",authmiddleware,updatelimiter,banr)


module.exports = router;