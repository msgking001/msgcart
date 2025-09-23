const ErrorHandler = require("../utils/errorhandler");
const catchasyncerror = require("./catchasyncerror");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

exports.isAuthenticatedUser= catchasyncerror(async (req,res,next)=>{
    const token = req.cookies.token; // Assuming you're using cookies to store the token
    if(!token){
        return next(new ErrorHandler("Please login to access this resource",401));
    }
    const decodedData= jwt.verify(token,process.env.JWT_SECRET);
    req.user= await User.findById(decodedData.id);
    next();

})
exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403));
        }
        next()
    }
}