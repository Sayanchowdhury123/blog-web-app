const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const cloudinary = require("cloudinary").v2;
const santizehtml = require("sanitize-html");
const Y = require("yjs");
const { generateHTML } = require("@tiptap/html/server");
const { createblogzod } = require("../validators/blogValidator");
const StarterKit = require("@tiptap/starter-kit").StarterKit;
const Document = require("@tiptap/extension-document").Document;
const Paragraph = require("@tiptap/extension-paragraph").Paragraph;
const Text = require("@tiptap/extension-text").Text;

const extensions = [
  StarterKit.configure({
    heading: true,
    bold: true,
    italic: true,
    strike: true,
    underline: true,
    code: true,
    blockquote: true,
    bulletList: true,
    orderedList: true,
    listItem: true,
    codeBlock: true,
    hardBreak: true,
    document: true,
    paragraph: true,
    text: true,
  }),
];

exports.createblogs = async (req, res) => {
  try {
    const { title, blogtext } = req.body;

    let tags;

    try {
      tags = JSON.parse(req.body.tags);
    } catch {
      return res.status(400).json({
        errors: ["Tags must be a valid array"],
      });
    }

    const parsed = createblogzod.safeParse({
      title,
      blogtext,
      tags,
    });

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => issue.message);

      return res.status(400).json({
        message: "Validation failed",
        error: errorMessages,
      });
    }

    if (!title || !blogtext || !tags) {
      return res.status(400).json({ msg: "invalid data" });
    }

    if (!Array.isArray(tags)) {
      return res.status(400).json({ msg: "tags must be an array" });
    }

    if (!req.user._id) {
      return res.status(400).json({ msg: "unauthorized" });
    }

    if (!req.files || !req.files.coverimage) {
      return res.status(400).json({ msg: "no file uploaded" });
    }

    const file = req.files.coverimage;

    let result;
    try {
      result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "coverimages",
      });
    } catch (error) {
      return res.status(500).json({ msg: "image upload error" });
    }

    const newblog = await Blogs.create({
      creator: req.user._id,
      title: title,
      blogtext: blogtext,
      tags: tags,
      coverimage: result.secure_url,
      cid: result.public_id,
    });

    res.status(201).json(newblog);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.fetchblogs = async (req, res) => {
  try {
    const blogs = await Blogs.find({ creator: req.user._id }).populate(
      "creator comments.user"
    );
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.editblog = async (req, res) => {
  const { blogid } = req.params;
  try {
    const { title } = req.body;
    const tags = JSON.parse(req.body.tags);

    const b = await Blogs.findById(blogid);
    if (!b) {
      return res.status(400).json({ msg: "blog not found" });
    }

    const file = req.files?.coverimage;

    let result;
    if (file) {
      try {
        if (b.cid) {
          await cloudinary.uploader.destroy(b.cid, {
            resource_type: "image",
          });
        }

        result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "coverimages",
        });
      } catch (error) {
        return res.status(500).json({ msg: "image upload error" });
      }
    }

    b.title = title || b.title;
    b.tags = tags || b.tags;
    b.cid = result?.public_id || b.cid;
    b.coverimage = result?.secure_url || b.coverimage;

    await b.save();
    await b.populate("creator comments.user");
    res.status(200).json("Blog updated");
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.deleteblog = async (req, res) => {
  const { blogid } = req.params;
  try {
    const b = await Blogs.findById(blogid);
    if (!b) {
      return res.status(400).json({ msg: "blog not found" });
    }

    try {
      if (b.cid) {
        await cloudinary.uploader.destroy(b.cid, {
          resource_type: "image",
        });
      }
    } catch (error) {
      return res.status(500).json({ msg: "image deletion error" });
    }

    await Blogs.findOneAndDelete({ _id: blogid });
    res.status(200).json(blogid);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.editcontent = async (req, res) => {
  const { blogid } = req.params;
  try {
    const { blogtext } = req.body;
    if (!blogtext) {
      return res.status(400).json("blogtext not found");
    }

    const sanitizedContent = santizehtml(blogtext, {
      allowedTags: [
        "p",
        "blockquote",
        "strong",
        "b",
        "i",
        "em",
        "u",
        "s",
        "strike",
        "code",
        "pre",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "a",
        "span",
        "sub",
        "sup",
        "br",
        "mark",
      ],
      allowedAttributes: {
        a: ["href", "target", "rel"],
        span: ["style"],
        "*": ["style"],
        mark: ["data-color", "style"],
      },
      allowedStyles: {
        "*": {
          color: [/^.*$/],
          "background-color": [/^.*$/],
          "text-align": [/^left$|^right$|^center$|^justify$/],
          "font-size": [/^\d+(px|em|rem|%)$/],
          "font-family": [/^.*$/],
          "line-height": [/^.*$/],
        },
      },
    });

    const b = await Blogs.findById(blogid);

    if (!b) {
      return res.status(400).json({ msg: "blog not found" });
    }

    b.blogtext = sanitizedContent || b.blogtext;
    await b.save();
    await b.populate("creator comments.user");

    res.json(b.blogtext);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.fetchblog = async (req, res) => {
  const { blogid } = req.params;
  try {
    const b = await Blogs.findById(blogid).populate("creator comments.user");

    if (!b) {
      return res.status(400).json({ msg: "blog not found" });
    }

    res.json(b);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.fetchdemoblog = async (req, res) => {
  const { blogid } = req.params;
  try {
    const b = await Blogs.findById(blogid).populate("creator comments.user");

    if (!b) {
      return res.status(400).json({ msg: "blog not found" });
    }

    if (b.title === "Live Collaboration Demo") {
      return res.json(b);
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.addview = async (req, res) => {
  const { blogid, userid } = req.params;
  try {
    if (!userid) {
      return res.status(400).json({ msg: "invalid id" });
    }

    if (req.user.id !== userid) {
      return res.status(400).json({ msg: "unauthorized" });
    }

    const b = await Blogs.findById(blogid);
    if (!b) {
      return res.status(400).json({ msg: "blog not found" });
    }

    const alreadyviewed = b.views.some(
      (id) => id.toString() === userid.toString()
    );

    if (alreadyviewed) {
      return res.status(200).json("already viewed");
    }

    b.views.push(userid);

    await b.save();
    await b.populate("views");

    res.status(200).json("view added");
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.selectusers = async (req, res) => {
  try {
    if (req.user.id) {
      const users = await User.find({
        role: { $in: ["editor", "writer"] },
        _id: { $ne: req.user.id },
      }).select("name profilepic role");

      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.startcollab = async (req, res) => {
  const { blogid, users } = req.body;
  try {
    const blog = await Blogs.findById(blogid);

    const uarray = [...users, req.user.id];

    blog.collabrators = uarray;

    await blog.save();
    res.status(200).json(blog.collabrators);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.endcollab = async (req, res) => {
  const { blogid } = req.body;

  try {
    const blog = await Blogs.findById(blogid);
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    const userId = req.user.id;

    let finalHtml = "<p>No content.</p>";

    if (blog.prosemirrorJson) {
      try {
        finalHtml = generateHTML(blog.prosemirrorJson, extensions);
      } catch (err) {
        finalHtml = blog.blogtext || "<p>Content unavailable.</p>";
        return res.status(500).json("HTML generation failed:");
      }
    } else if (blog.blogtext) {
      finalHtml = blog.blogtext;
    }

    blog.blogtext = finalHtml;
    blog.yjsupdate = undefined;
    blog.collabrators = blog.collabrators.filter(
      (id) => id?.toString() !== userId
    );

    await blog.save();
    res.status(200).json(blog.collabrators);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.saveyjsupadte = async (req, res) => {
  try {
    const { yjsUpdate, prosemirrorJson } = req.body;
    const blog = await Blogs.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const userId = req.user.id;

    const isAuthorized =
      blog.creator?.toString() === userId ||
      blog.collabrators.some((id) => id?.toString() === userId);

    if (!isAuthorized) {
      return res.status(403).json({ error: "Not authorized" });
    }

    blog.yjsupdate = yjsUpdate;
    blog.prosemirrorJson = prosemirrorJson;
    await blog.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Save failed" });
  }
};

exports.related = async (req, res) => {
  try {
    const { blogid } = req.params;

    if (!blogid) {
      return res.status(404).json({ error: "invalid blogid" });
    }
    const tags = JSON.parse(req.query.tags);

    if (!tags) {
      return res.status(404).json({ error: "invalid tags" });
    }

    const related = await Blogs.find({
      tags: { $in: tags },
      _id: { $nin: blogid },
    })
      .limit(3)
      .populate("creator");

    if (!related) {
      return res.status(404).json({ error: "no related blogs found" });
    }

    res.status(200).json(related);
  } catch (error) {
    res.status(500).json({ error: "Save failed" });
  }
};
