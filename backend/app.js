require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cloudinary = require("cloudinary").v2;
const authroutes = require("./routes/authroutes")
const fileupload = require("express-fileupload")
const blogroutes = require("./routes/blogroutes")
const editorroutes = require("./routes/editorroutes")
const profileroutes = require("./routes/userroutes")
const homeroutes = require("./routes/homeroutes")
const searchroutes = require("./routes/searchroutes")
const followersroute = require("./routes/followerroute")
const writerroutes = require("./routes/writerroutes")
const earoutes = require("./routes/Eanalytics")
const notificationroutes = require("./routes/notificationroutes")
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
app.use("/api/editor",editorroutes)
app.use("/api/profile", profileroutes)
app.use("/api/home",homeroutes)
app.use("/api/sp",searchroutes)
app.use("/api/fpage",followersroute)
app.use("/api/writers",writerroutes)
app.use("/api/ea",earoutes)
app.use("/api/notify",notificationroutes)

module.exports = app;
