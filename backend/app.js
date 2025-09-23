const express=require('express')
const app=express()
const products=require('./routes/product');
const auth=require('./routes/Auth');
const errorMiddleware = require('./middleware/error');
const order= require('./routes/order');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Middleware to parse cookies
app.use(express.json());
// Middleware to parse JSON bodies
app.use('/api/v1',products);
app.use('/api/v1',auth);
app.use('/api/v1',order);

app.use(errorMiddleware); // Error handling middleware
module.exports=app