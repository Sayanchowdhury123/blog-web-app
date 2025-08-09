const mogoose = require("mongoose")

const savedschema = new mogoose.Schema({
  creator: { type: mogoose.Schema.Types.ObjectId, ref: "User" },
  
},{timestamps: true})

module.exports = mogoose.model("Save", savedschemaavedschema)