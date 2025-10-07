
const mogoose = require("mongoose")

const analyticpschema = new mogoose.Schema({
 postid: {  type: mogoose.Schema.Types.ObjectId, ref: "Blog"},
 location: {
    country: String,
    city: String
 },
 device: String,
 entryat: Date,
 exitat: Date,
 duration: Number,

},{timestamps: true})

module.exports = mogoose.model("Analytic", analyticpschema)

