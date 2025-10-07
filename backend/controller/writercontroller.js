const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");
const Analytics = require("../models/Analytics");

exports.onlywrittenbywriter = async (req, res) => {
  try {
    if (req.user.id) {
      const blogs = await Blogs.find({
        creator: req.user.id,
      });

      res.status(200).json(blogs);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.popularblogs = async (req, res) => {
  try {
    const blogs = await Blogs.find({
      creator: req.user.id,
    });

    if (blogs.length === 0) {
      return res.status(400).json({ msg: "Blogs not found" });
    }
    const approved = blogs.filter((h) => h.approval === true).slice(0, 5);

    const tscore = (b) => {
      const enagement =
        b.views?.length + b.views?.length * 2 + b.views?.length * 3;

      return enagement;
    };

    const trending = approved.sort((a, b) => tscore(b) - tscore(a));

    res.status(200).json(trending);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.trackview = async (req, res) => {
  try {
    const ip =
      process.env.NODE_ENV === "development" ? "8.8.8.8" : req.headers["x-forwarded-for"]?.split(",")[0];

    const geo = geoip.lookup(ip);
    const parser = new UAParser(req.headers["user-agent"]);
    const devicetype = parser.getResult().device.type || "Dekstop";

    const newa = await Analytics.create({
      postid: req.params.postid,
      location: {
        country: geo?.country || "unknown",
        city: geo?.city || "unknown",
      },
      device: devicetype,
      entryat: new Date(),
    });
  
    
    res.status(200).json(newa);
  } catch (error) {
    console.log(error);
  }
};

exports.traceentry = async (req, res) => {
  try {
    const entry = await Analytics.create({
      postid: req.params.postid,
      entryat: new Date(),
    });
   
    res.json(entry);
  } catch (error) {
    console.log(error);
  }
};

exports.traceexit = async (req, res) => {
  const { exitat } = req.body;

  try {
    const analytic = await Analytics.findById(req.params.entryid);

    if (analytic) {
      analytic.exitat = exitat ? new Date(exitat) : new Date();
      analytic.duration = (analytic.exitat - analytic.entryat) / 1000;
      await analytic.save();
    }
  
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};
