const mogoose = require("mongoose")

const userschema = new mogoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    role: {type: String, enum: ["reader","writer","editor"], default:"reader"},
    provider: {type: String, default: 'local'},
    googleid: String,
    profilepic: {type: String},
    pid: {type: String},
    savedblogs:[{ type: mogoose.Schema.Types.ObjectId,ref:"Blog"},],
    
},{timestamps: true})

module.exports = mogoose.model("User", userschema)