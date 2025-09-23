module.exports= func =>(req,res,next)=>
    Promise.resolve(func(req,res,next)).catch(next);
    // This middleware catches any errors that occur in the async functions and passes them to the next middleware, which is typically the error handling middleware.

