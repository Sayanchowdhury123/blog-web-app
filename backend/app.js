require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cloudinary = require("cloudinary").v2;
const authroutes = require("./routes/authroutes")
const fileupload = require("express-fileupload")
const blogroutes = require("./routes/blogroutes")


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileupload({useTempFiles: true}))


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

app.use("/api/auth", authroutes)
app.use("/api/blogs", blogroutes)



module.exports = app;
