const mogoose = require("mongoose");

const blogschema = new mogoose.Schema(
  {
    title: { type: String, required: true },
    blogtext: { type: String, required: true },
    coverimage: { type: String },
    tags: [{ type: String }],
    creator: { type: mogoose.Schema.Types.ObjectId, ref: "User" },

    comments: [
      {
        user: { type: mogoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likes: [{ type: mogoose.Schema.Types.ObjectId, ref: "User" },],
    dislikes: [{ type: mogoose.Schema.Types.ObjectId, ref: "User" },],
    cid: {type: String},
  },
  { timestamps: true }
);

module.exports = mogoose.model("Blog", blogschema);
