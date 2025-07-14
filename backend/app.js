require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cloudinary = require("cloudinary").v2;




const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

module.exports = app;
