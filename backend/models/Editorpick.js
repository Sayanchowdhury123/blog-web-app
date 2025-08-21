const mogoose = require("mongoose")

const editorpschema = new mogoose.Schema({
  editorpicks: [{
    type: mogoose.Schema.Types.ObjectId, ref: "Blog"
  },],
  
},{timestamps: true})

module.exports = mogoose.model("Editorp", editorpschema)

