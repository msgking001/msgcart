const CatchAsyncErrors = require('../middleware/catchasyncerror');
const User = require('../models/usermodel');
const sendemail = require('../utils/email');
const ErrorHandler = require('../utils/errorhandler');
const sendtoken=require("../utils/jwt");
const crypto=require('crypto')
//registeruser-/api/v1/register
exports.registeruser= CatchAsyncErrors(async (req, res, next) => {
   const {name ,email,password,avatar}= req.body;
    const user = await User.create({
         name,
         email,
         password,
         avatar
    });
    const token=user.getJwtToken(); 
   sendtoken(user,200,res);
})
//login user -/api/v1/login
exports.loginuser=CatchAsyncErrors(async (req, res, next) =>{
 const {email,password}=req.body;
    //checking if email and password are entered by user

 if(!email || !password){
    return next(new ErrorHandler("Please enter email and password",400));
 }
 //finding data in database
 const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    if(!await user.isValidPassword(password)){
            return next(new ErrorHandler("Invalid email or password",401));
        }
    sendtoken(user,200,res);

})
//logoutuser-/api/v1/logout
exports.logoutuser=CatchAsyncErrors(async (req, res, next) => {
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    .status(200)
    .json({
        success:true,
        message:"Logged out successfully"
    }

    )

})
//forgotpassword-/api/v1/password/forget
exports.forgotPassword=CatchAsyncErrors(async (req, res, next)=>{
   const user= await User.findOne({email:req.body.email});
   if(!user){
       return next(new ErrorHandler("User not found with this email",404));
   }
 const resetToken=user.getResetToken(); // Generate reset token
 await user.save({validateBeforeSave:false}); // Save the user with the reset token
 // create reset password url
 const resetURL=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
 const message=`Your password reset token is as follows:\n\n${resetURL}\n\nIf you have not requested this email, then ignore it.`;
    try {
        sendemail(
            {
                email:user.email,
                subject:"msgcart Password Revoery",
                message
            })
            res.status(200).json({
                sucess:true,
                message:`Email  sent to ${user.email}`
            })
        

    }catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500));
    }

}) 
//resetpassword-/api/v1/password/reset/
exports.resetPassword= CatchAsyncErrors(async(req,res,next)=>{
 const resetPasswordToken= crypto.createHash('sha256').update(req.params.token).digest('hex');
 const user= await User.findOne(
    {
        resetPasswordToken,
        resetPasswordExpire:{
            $gt:Date.now()
        }
    }
 )
 if(!user){
    return next(new ErrorHandler('Password reset tokn is invalid or expired'));

 }
 if (req.body.password!==req.body.confirmPassword) {
    return next(new ErrorHandler('Pass word does not match'));
    
 }
 user.password=req.body.password;
 user.resetPasswordToken =undefined;
 user.resetPasswordExpire= undefined;
 await user.save({validateBeforeSave: false})
 sendtoken(user,201,res);

}
)
//Get User Profile api/v1/myprofile
exports.getUserProfile=CatchAsyncErrors(async(req,res,next)=>{
 const user= await User.findById(req.user.id);
 res.status(200).json({
    success:true,
    user
    }

 )
}

)
//Change passwordn -api/v1/change
exports.changePassword=CatchAsyncErrors(async(req,res,next)=>{
    const user= await User.findById(req.user.id).select('+password');

    //checking old password
    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next( new ErrorHandler('Old Password is incorrect',401))


    }
    //assigning new password
    user.password =req.body.password;
    await user.save();
    res.status(200).json({
        success:true
    })

}
)
//updatprofile-api/v1/update
exports.updateProfile =CatchAsyncErrors(async (req,res,next) => {
    const newUserData ={
        name:req.body.name,
        email: req.body.email
    }
const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
    })
    res.status(200).json({
        success:true,
        user
    })
})
//Admin :Get all user -/api/v1/admin/users
exports.getAllUser= CatchAsyncErrors( async (req,res,next) => {
   const user= await User.find();
   res.status(200).json({
    success:true,
    user
   })
    
})
//Admin :Get specific user -/api/v1/admin/users/:id
exports.getUser= CatchAsyncErrors( async (req,res,next) => {
   const user= await User.findById(req.params.id);
   if(!user){
    return next( new ErrorHandler(" User Not found",404))
   }
   res.status(200).json({
    success:true,
    user
   })
    
})
//Admin :Update user role
exports.UpdateUser = CatchAsyncErrors( async (req,res,next) => {
  const newUserData ={
        name:req.body.name,
        email: req.body.email,
        role:req.body.role
    }
const user= await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
    })
    res.status(200).json({
        success:true,
        user
    })
    
})
//Admin :Delete user
exports.DeleteUser = CatchAsyncErrors( async (req,res,next) => {
    let user= await User.findById(req.params.id);
   if(!user){
    return next( new ErrorHandler(" User Not found",404))
   } 
   await User.findByIdAndDelete(req.params.id);//we using mongoose 7 so remove() was not valid
 
    res.status(200).json({
        success:true,
        
    })
    
})