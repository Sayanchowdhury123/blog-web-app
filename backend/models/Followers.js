const mogoose = require("mongoose")

const follwerschema = new mogoose.Schema({
  owner: { type: mogoose.Schema.Types.ObjectId, ref: "User" },
  followers: [{
    type: mogoose.Schema.Types.ObjectId, ref: "User"
  },],
  following:[
  {
    type: mogoose.Schema.Types.ObjectId, ref: "User"
  },
  ],
  
},{timestamps: true})

module.exports = mogoose.model("Follower",follwerschema)
