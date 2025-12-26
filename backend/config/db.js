const mongoose = require("mongoose");
const {createDemoBlog} = require("../scripts/create-demo-blog");
const logger = require("../utils/logger");

const connectdb = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL)
        logger.info("database connected");
        
    } catch (error) {
         logger.error(error);
    }
}

module.exports = connectdb;