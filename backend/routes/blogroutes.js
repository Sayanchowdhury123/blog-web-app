const express = require("express")
const router = express.Router();
const User = require("../models/User")
const Blogs = require("../models/Blogs");
const { authmiddleware, authorizerole } = require("../middleware/auth");
const { createblogs,fetchblogs, deleteblog, editblog, editcontent, fetchblog, addview, selectusers, startcollab, endcollab, saveyjsupadte, fetchdemoblog, related } = require("../controller/Blogcontorller");
const rateLimit = require("express-rate-limit")
const {ipKeyGenerator} = require("express-rate-limit");
const { validate } = require("../middleware/validator");
const { createblogzod } = require("../validators/blogValidator");

const yjslimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => {
    if (req.user && req.user.id) {
      return `user:${req.user.id.toString()}`;
    }

    return ipKeyGenerator(req);
  },
  message: {
    message: "too many save yjs requests",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const createbloglimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => {
    if (req.user && req.user.id) {
      return `user:${req.user.id.toString()}`;
    }

    return ipKeyGenerator(req);
  },
  message: {
    message: "too many blog creation requests",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const selectuserlimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  keyGenerator: (req) => {
    if (req.user && req.user.id) {
      return `user:${req.user.id.toString()}`;
    }

    return ipKeyGenerator(req);
  },
  message: {
    message: "too many user selection requests",
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
    message: "too many blog fetching requests",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const blogupadtelimiter = rateLimit({
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


router.get("/get-demo",getLimiter,fetchdemoblog)
router.get("/related/:blogid/r",authmiddleware,related)
router.get("/",authmiddleware,getlimiter,authorizerole("writer","editor"),fetchblogs)
router.get("/get-users",authmiddleware,selectuserlimiter,authorizerole("writer","editor"),selectusers)
router.get("/:blogid",authmiddleware,getlimiter,fetchblog)
router.post("/saveyjs/:id",authmiddleware,yjslimiter,saveyjsupadte)
router.post("/create-blog",authmiddleware,createbloglimiter,authorizerole("writer","editor"),createblogs)
router.put("/:blogid/update-blog",authmiddleware,blogupadtelimiter,authorizerole("writer","editor"),editblog)
router.patch("/:blogid/edit-content",authmiddleware,blogupadtelimiter,authorizerole("writer","editor"),editcontent)
router.patch("/:blogid/start-collab",authmiddleware,blogupadtelimiter,authorizerole("writer","editor"),startcollab)
router.patch("/:blogid/end-collab",authmiddleware,blogupadtelimiter,authorizerole("writer","editor"),endcollab)
router.patch("/:blogid/add-view/:userid",authmiddleware,blogupadtelimiter,addview)
router.delete("/:blogid/del-blog",authmiddleware,deletelimiter,authorizerole("writer","editor"),deleteblog)


module.exports = router;