const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
const blacklistModel = require("../models/blacklist.model");
const tokenBlackListModel = require("../models/blacklist.model");
/**
 * -user register controller
 * -POST/api/auth/register
 */
async function registerUser(req,res){
    const {email,password,name} = req.body;
    
    const isExists = await userModel.findOne({
        email:email
    })

    if(isExists){
        return res.status(422).json({
            message : "User already exixsts with email.",
            status : "Failed"
        })
    }


    const user = await userModel.create({
        email,
        password,
        name
    })

    const token = jwt.sign({userId : user._id},
             process.env.JWT_KEY,{
            expiresIn : "3d"
        }
    )

    res.cookie("token",token);

    res.status(201).json({
        user: {
            _id : user._id,
            email : user.email,
            name : user.name
        },
        token
    })

    await emailService.sendRegistrationEmail(user.email,user.name);
}

/**
 * -user login controller
 * -post/api/auth/login
 */
async function loginUser(req,res){
    const {email,password} = req.body;

    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            message : "Email or Password is INVALID"
        })
    }

    const isValidpassword =  await user.comparePassword(password);

    if(!isValidpassword){
        return res.status(401).json({
            message : "Email or password is INVALID"
        })
    }

    const token = jwt.sign({userId : user._id},
             process.env.JWT_KEY,{
            expiresIn : "3d"
        }
    )

    res.cookie("token",token);

    res.status(200).json({
        message : "User logged in succesfully",
        user: {
            _id : user._id,
            email : user.email,
            name : user.name
        },
        token
    })
}

/**
 * -USER logout Controller
 * -POST/api/auth/logout
 */
async function logoutUser(req,res){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if(!token){
        return res.status(400).json({
            message : "Invalid Token"
        })
    }

    res.cookie("token","");
    await tokenBlackListModel.create({
        token : token
    })

    return res.status({
        message : "User logged out !!"
    })
}


module.exports = {registerUser,loginUser,logoutUser};