require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cloudinary = require("cloudinary").v2;
const authroutes = require("./routes/authroutes")



const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/auth", authroutes)

module.exports = app;
