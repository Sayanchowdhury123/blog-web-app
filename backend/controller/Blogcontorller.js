const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blogs = require("../models/Blogs");
const cloudinary = require("cloudinary").v2;
const santizehtml = require("sanitize-html")

exports.createblogs = async (req, res) => {
  try {
    const { title, blogtext } = req.body;

    const tags = JSON.parse(req.body.tags)


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
      console.log(error);
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
    console.log(error);
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
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.editblog = async (req, res) => {
  const { blogid } = req.params;
  try {
    const { title } = req.body;
     const tags = JSON.parse(req.body.tags)
     
      const b = await Blogs.findById(blogid)
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
        console.log(error);
        return res.status(500).json({ msg: "image upload error" });
      }
    }

 
    b.title = title || b.title;
    b.tags = tags || b.tags;
    b.cid = result?.public_id || b.cid;
    b.coverimage = result?.secure_url || b.coverimage;

    await b.save();
    await b.populate("creator comments.user")
    res.status(200).json("Blog updated")

  } catch (error) {
        console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.deleteblog = async (req, res) => {
  const { blogid } = req.params;
  try {

    const b = await Blogs.findById(blogid)
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
          console.log("image deletion error");
       }
      
    await Blogs.findOneAndDelete({_id: blogid})
    res.status(200).json(blogid);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
};

exports.editcontent = async (req,res) => {
    const { blogid } = req.params;
  try {
      const { blogtext } = req.body;
      if(!blogtext){
        return res.status(400).json("blogtext not found")
      }
     

const sanitizedContent =  santizehtml(blogtext, {
  allowedTags: [
    'p', 'blockquote', 'strong', 'b', 'i', 'em', 'u', 's', 'strike', 'code',
    'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'span',
    'sub', 'sup', 'br','mark'
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    span: ['style'],
    '*': ['style'], 
    mark: ['data-color','style'],
  },
  allowedStyles: {
    '*': {
      
      'color': [/^.*$/],
      'background-color': [/^.*$/],
      'text-align': [/^left$|^right$|^center$|^justify$/],
      'font-size': [/^\d+(px|em|rem|%)$/],
      'font-family': [/^.*$/],
      'line-height': [/^.*$/],
 },
 },
});

     const b = await Blogs.findById(blogid);
    
    if (!b) {
      return res.status(400).json({ msg: "blog not found" });
    }
    

    b.blogtext = sanitizedContent || b.blogtext;
    await b.save()
     await b.populate("creator comments.user")

     res.json(b.blogtext)

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
}

exports.fetchblog = async (req,res) => {
  const { blogid } = req.params;
  try {
     const b = await Blogs.findById(blogid).populate("creator comments.user")
      if (!b) {
      return res.status(400).json({ msg: "blog not found" });
    }

    res.json(b)
  } catch (error) {
     console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
}


exports.addview = async (req,res) => {
   const { blogid,userid } = req.params;
   try {
    
    if(!userid){
        return res.status(400).json({ msg: "invalid id" });
    }

      if (req.user.id !== userid) {
      return res.status(400).json({ msg: "unauthorized" });
    }

         const b = await Blogs.findById(blogid)
      if (!b) {
      return res.status(400).json({ msg: "blog not found" });
    }

     const alreadyviewed = b.views.some(
      (id) => id.toString() === userid.toString()
    );
 

    if(alreadyviewed){
      return res.status(200).json("already viewed")
    }
     
    b.views.push(userid)
    

    await b.save()
    await b.populate("views")

    res.status(200).json("view added")

   } catch (error) {
     console.log(error);
    res.status(500).json({ msg: "internal server error" });
   }
}

exports.selectusers = async (req,res) => {
  try {
   
    if(req.user.id){
       const users = await User.find({
      _id: {$ne: req.user.id},
      role: {$in: ["editor","writer"]},
    }).select("name profilepic role")
    

    res.status(200).json(users)
    }
    

  } catch (error) {
    console.log(error);
     res.status(500).json({ msg: "internal server error" });
  }
}

