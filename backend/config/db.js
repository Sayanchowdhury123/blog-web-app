const mongoose = require("mongoose");
const {createDemoBlog} = require("../scripts/create-demo-blog")

const connectdb = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL)
        console.log("database connected");
        
    } catch (error) {
         console.log(error);
    }
}

module.exports = connectdb;