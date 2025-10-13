const mongoose = require("mongoose");

const editoranalyticpschema = new mongoose.Schema(
  {
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalReviewed: {
      type: Number,
      default: 0,
    },

    blogsReviewed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    blogsEdited: [
      {
        blogid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Blog",
        },
        editedAt: { type: Date },
        exitAt: { type: Date },
        duration: {type: Number},
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Editoranalytic", editoranalyticpschema);
