const sendtoken=(user,statusCode,res)=>{
    // Create JWT token
    const token=user.getJwtToken();
    //settingcookies
    const options={
        expreis:new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000), // Convert days to milliseconds
        httpOnly:true // to prevent client side script from accessing the cookie
    }
    res.status(statusCode)
    .cookie("token", token, options) // Set the cookie with the token
    .json({
        success:true,
        token,
        user
    });

}
module.exports=sendtoken;