const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authmiddleware = async (req,res,next) => {
    let token = req.header("Authorization");
    
    
    if(token && token.startsWith("Bearer")){
        try {
            token = token.split(" ")[1];
            const decode = jwt.verify(token,process.env.JWT);
            req.user = await User.findById(decode.id).select("-password");
            
            next();
        } catch (error) {
              res.status(401).json({message: "not authorized, token failed"})  ;
        }
    } else{
          res.status(401).json({message: "no token"})  ;
    }
}


const authorizerole =  (...roles) => {
    return (req,res,next) => {
     if(!roles.includes(req.user.role)){
        return res.status(400).json("access forbidden")
     }
     next();
    }
}

module.exports = {authmiddleware,authorizerole}