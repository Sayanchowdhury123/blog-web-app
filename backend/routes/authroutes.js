const express = require("express")
const router = express.Router();
const {signup,login} = require("../controller/authcontroller")
const rateLimit = require("express-rate-limit")
const {ipKeyGenerator} = require("express-rate-limit")

const loginlimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "too many login requests",
  },
});

const registerlimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    message: "too many register requests",
  },
});

const logoutlimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => {
    if (req.user && req.user._id) {
      return `user:${req.user._id.toString()}`;
    }

    return ipKeyGenerator(req);
  },
  message: {
    message: "too many logout requests",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


router.post("/signup",registerlimiter,signup)
router.post("/login",loginlimiter,login)

module.exports = router;