const app=require('./app');
const dotnv=require('dotenv');
const path=require('path');
const connectdatabase = require('./config/database');

dotnv.config({path:path.join(__dirname,'config/config.env')});
connectdatabase();
const server= app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});
process.on('unhandledRejection',(err)=>{
    console.error(`Unhandled Rejection: ${err.message + err.stack}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(()=>{
        process.exit(1);
    })
})
process.on('uncaughtException',(err)=>{
 
    console.error(`Uncaught Exception: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception');
    server.close(()=>{
        process.exit(1);
    })
})
