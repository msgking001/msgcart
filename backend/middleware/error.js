const { Error } = require("mongoose");
const { stack } = require("../routes/Auth");
const ErrorHandler = require("../utils/errorhandler");

module.exports=(err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if(process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({   
            success: false,
            message: err.message,
            stack: err.stack,
            error:err
        })}
        if(process.env.NODE_ENV === 'production') {
            let message = err.message || 'Internal Server Error';
            let error={...err};
            if(err.name=='ValidationError') {
                message = Object.values(err.errors).map(val => val.message).join(', ');
                error = new Error(message);
                err.statusCode= 400
               
            }
            if(err.name === 'CastError') {
                message = `Resource not found. Invalid: ${err.path}`;
                error = new Error(message,400);
                 err.statusCode= 400
            }
            if(err.code === 11000){
                let message=`This email was already used`;
                error = new Error(message);
                 err.statusCode= 400

            } 

            if(err.name=='JSONWebTokenError'){
                 message='JSON Web Token is ivalid .Try Again';
                error=new Error(message);
                 err.statusCode= 400
            }
            if(err.name=='TokenExpiredError'){
                 message='JSON Web Token is expired .Try Again';
                error=new Error(message);
                 err.statusCode= 400
            }
    res.status(err.statusCode).json({
        success: false,
        status:err.statusCode,
        message:error.message|| 'Internal Server Error',
    
        // In production, we do not expose the stack trace
     
    });
}
}