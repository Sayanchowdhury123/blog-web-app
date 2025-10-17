const mogoose = require("mongoose");

const notificationschema = new mogoose.Schema(
  {
    message: { type: String },
    user: { type: mogoose.Schema.Types.ObjectId, ref: "User" },
    blog: { type: mogoose.Schema.Types.ObjectId, ref: "Blog" },
    link: {type: String},
    read: {type: Boolean,default: false},
    type: {type: String, enum:["approval","rejection","liked","newcomment","newfollower"]},

  },
  { timestamps: true }
);

module.exports = mogoose.model("Notification", notificationschema);
