const mogoose = require("mongoose")

const userschema = new mogoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    role: {type: String, enum: ["reader","writer","editor"], default:"reader"},
    provider: {type: String, default: 'local'},
    googleid: String,
},{timestamps: true})

module.exports = mogoose.model("User", userschema)