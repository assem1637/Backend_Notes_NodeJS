process.on("uncaughtException", (err) => {

    console.log("UncaughtException", err);

});


import dotenv from 'dotenv';
dotenv.config({path: "./config/.env"});




import express from 'express';
import dbConnection from './src/DB/dbConnection.js';
import morgan from 'morgan';
import API_Errors from './src/Utils/APIErrors.js';





const app = express();
const port = process.env.PORT || 3000;


dbConnection();



app.use(express.json());


if(process.env.MODE_NOW === "Development") {

    app.use(morgan("dev"));

};



app.all("*" , (req,res,next) => {

    return next(new API_Errors(`This Is Route: ${req.originalUrl} Is Not Found The Server`, 404));

});



app.use((err,req,res,next) => {

    err.statusCode = err.statusCode || 404;

    if(process.env.MODE_NOW === "Development") {

        res.status(err.statusCode).json({message: err.message, statusCode: err.statusCode, err, stack: err.stack});
    
    } else {

        res.status(err.statusCode).json({message: err.message, statusCode: err.statusCode, err});

    };

});



app.listen(port, () => {

    console.log(`Server Is Running At Port: ${port} ...`);

});



process.on("unhandledRejection", (err) => {

    console.log("UnhandledRejection", err);

});