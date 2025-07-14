const mongoose = require("mongoose");

const connectdb = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("database connected");
    } catch (error) {
         console.log(error);
    }
}

module.exports = connectdb;