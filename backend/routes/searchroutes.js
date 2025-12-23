const express = require("express");
const { authmiddleware } = require("../middleware/auth");
const { getprofile, postpic, updateprofile, delprofile, saveblog, getsavedblogs, trackhistory, getrecommdations } = require("../controller/profilecontroller");
const { searchblog, allblogs, sorting, getsh, addsh, filterblog } = require("../controller/searchcontroller");
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


router.get("/allblogs",getLimiter,allblogs)
router.get("/search",getLimiter,searchblog)
router.get("/sorting",getLimiter,sorting)
router.get("/filter",getLimiter,filterblog)
router.get("/getsh",authmiddleware,getlimiter,getsh)
router.patch("/addsh",authmiddleware,updatelimiter,addsh)

module.exports = router;