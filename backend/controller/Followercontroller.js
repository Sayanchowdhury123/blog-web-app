const Blogs = require("../models/Blogs");
const User = require("../models/User");

exports.following = async (req,res) => {
    const {fid,uid} = req.params;
    try {
        if(uid !== req.user.id){
            return res.status(404).json("unauthorized")
        }
        const goingtofollow = await User.findById(fid).select("-password -__v")
        const followinglist = await User.findById(uid).select("-password -__v")

        if(!goingtofollow || !followinglist){
             return res.status(404).json("user not fonud")
        }

        const alreadyfollowing = goingtofollow.followers.some((f) => f.toString() === userid.toString())
        if(alreadyfollowing){
        goingtofollow.followers =  goingtofollow.followers.filter((f) => f.toString() !== userid.toString())
         followinglist.following =  followinglist.following.filter((f) => f.toString() !== followingid.toString())

        }else{
            goingtofollow.followers.push(userid)
           followinglist.following.push(followingid)
        }

        await goingtofollow.save()
        await followinglist.save()

        res.status(200).json({msg: alreadyfollowing ? "unfollowd" : "followed"})

    } catch (error) {
          console.log(error);
      res.status(500).json({ msg: "internal server error" });
    }
}


exports.getuserinfo = async (req,res) => {
    const {userid} = req.params; 
    try {
        const blogs = await Blogs.find({creator: userid}).populate("creator comments.user")
        const userinfo = await User.findById(userid).select("-password -__v")

        if(!userinfo){
             return res.status(404).json("user info not fonud")
        }

        if(blogs.length === 0){
                 return res.status(404).json("blogs not fonud")
        }

        res.status(200).json({
            blogs: blogs,
            userinfo: userinfo
        })
    } catch (error) {
         console.log(error);
      res.status(500).json({ msg: "internal server error" });
    }
}

exports.getfollowerinfo = async (req,res) => {
    const {followerid} = req.params; 
    try {
     
        const userinfo = await User.findById(followerid).select("-password -__v").populate("followers name profilepic")

        if(!userinfo){
             return res.status(404).json("user info not fonud")
        }


        res.status(200).json(userinfo)
    } catch (error) {
         console.log(error);
      res.status(500).json({ msg: "internal server error" });
    }
}

exports.getfollowinginfo = async (req,res) => {
    const {followingid} = req.params; 
    try {
     
        const userinfo = await User.findById(followingid).select("-password -__v").populate("following name profilepic")

        if(!userinfo){
             return res.status(404).json("user info not fonud")
        }


        res.status(200).json(userinfo)
    } catch (error) {
         console.log(error);
      res.status(500).json({ msg: "internal server error" });
    }
}


