const mongoose = require("mongoose");
const {createDemoBlog} = require("../scripts/create-demo-blog")

const connectdb = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("database connected");
        createDemoBlog()
    } catch (error) {
         console.log(error);
    }
}

module.exports = connectdb;