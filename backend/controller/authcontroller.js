const User = require("../models/User");
const bcrypts = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json("user already exists");
    }
    const salt = await bcrypts.genSalt(10);
    const hashedpassword = await bcrypts.hash(password, salt);

    const newuser = new User({
      name: name,
      email: email,
      password: hashedpassword,
      role: role,
    });

    await newuser.save();

    res.status(201).json({ message: "user signed up successfully" });
  } catch (error) {
    res.status(500).json({ message: "registration error", error });
    console.log(error);
  }
};

exports.login = async (req,res) => {
    try {
        const {email,password} = req.body;
        const existinguser = await User.findOne({email})
        if(!existinguser){
            return res.status(400).json("user does not exist")
        }

        const ismatch =  bcrypts.compare(password,existinguser.password)
        if(!ismatch){
              return  res.status(400).json({message: "invalid crediatials"})
        }

        const token = jwt.sign({id: existinguser._id}, process.env.JWT, {expiresIn:"14d"})
        res.status(200).json({
            id: existinguser._id,
            name: existinguser.name,
            token: token,
            email: existinguser.email,
            role: existinguser.role
        })

    } catch (error) {
          res.status(500).json({message: "server error"})
        console.log(error);
    }
}
