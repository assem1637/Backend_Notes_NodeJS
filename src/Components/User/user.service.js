import userModel from "./user.model.js";
import API_Errors from "../../Utils/APIErrors.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendConfirmEmail from "../../Utils/msgConfirmEmail.js";
import sendResetCode from "../../Utils/msgResetPassword.js";





cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME_CLOUDINARY, 
    api_key: process.env.API_KEY_CLOUDINARY, 
    api_secret: process.env.API_SECRET_CLOUDINARY 
});









// Handle Errors

const ErrorHandler = (fun) => {

    return (req,res,next) => {

        fun(req,res,next).catch((err) => {

            return next(new API_Errors(err.message, 404));

        });

    };

};










// Register

export const Register = ErrorHandler(async (req,res,next) => {

    const user = await userModel.findOne({email: req.body.email});

    if(user) {

        return next(new API_Errors(`This Is User: ${user.email} Is Already Exists`, 400));

    };


    if(req.body.password !== req.body.rePassword) {

        return next(new API_Errors(`Password And rePassword Doesn't Match`, 400));

    };



    const hash = bcrypt.hashSync(req.body.password, 5);
    req.body.password = hash;
    req.body.rePassword = hash;

    
    if(req.file) {

        cloudinary.v2.uploader.upload(req.file,
        { public_id: "olympic_flag" }, 
        function(error, result) {

            if(error) {

                console.log(error);

            } else {

                console.log(result); 

            };

        });

    };


    const token = jwt.sign({ 

        email: req.body.email

    }, process.env.SIGN_UP);


    sendConfirmEmail(req.body.email, req.body.name, token, req.protocol, req.headers.host);


    const newUser = userModel(req.body);
    await newUser.save();


    res.status(200).json({message: "Success", data: newUser});

});







// Login

export const login = ErrorHandler(async (req,res,next) => {

    const user = await userModel.findOne({email: req.body.email});

    if(!user) {

        return next(new API_Errors(`This Is User: ${req.body.email} Is Doesn't Exists`, 400));

    };


    const match = await bcrypt.compare(req.body.password, user.password);

    if(!match) {

        return next(new API_Errors(`Your Password Incorrect`, 400));

    };


    if(!user.confirmEmail) {

        return next(new API_Errors(`Please Confirm Your Email, Then Try Again`, 400));

    };


    const token = jwt.sign({ 

        id: user._id,
        name: user.name,
        age: user.age,
        email: user.email,
        gender: user.gender,
        confirmEmail: user.confirmEmail,
        phone: user.phone,
        isActive: user.isActive,
        profilePicture: user.profilePicture

    }, process.env.SIGN_IN);


    res.status(200).json({message: "Success", token});

});









// Confirm Email

export const emailConfirmation = ErrorHandler(async (req,res,next) => {

    const token = req.params.token;

    jwt.verify(token, process.env.SIGN_UP,async function(err, decoded) {
        
        if(err) {

            res.status(404).json({message: "Invalid Token", err});

        } else {

            const user = await userModel.findOne({email: decoded.email});

            if(user) {

                user.confirmEmail = true;
                await user.save();

                res.status(200).json({message: "Your email address has already been confirmed."});

            } else {

                res.status(400).json({message: "User Not Found"});

            };

        };

    });

});









// Authentication 

export const Authentication = ErrorHandler(async (req,res,next) => {

    const token = req.headers.token;

    jwt.verify(token, process.env.SIGN_IN,async function(err, decoded) {
        
        if(err) {

            res.status(404).json({message: "Invalid Token", err});

        } else {

            const user = await userModel.findOne({email: decoded.email});

            if(!user) {

                return next(new API_Errors(`This Is User: ${decoded.email} Is Doesn't Exists`, 400));

            };

        
            if(parseInt(user.changePasswordAt / 1000)  > decoded.iat) {

                return next(new API_Errors(`You Change Password At: ${user.changePasswordAt}`, 400));

            };
            

            req.user = decoded;
            next();

        };

    });

});








// Update Info Of User

export const updateInfo = ErrorHandler(async (req,res,next) => {

    let user = await userModel.findOne({email: req.user.email});

    if(!user) {

        return next(new API_Errors(`This Is User: ${req.user.email} Is Doesn't Exists`, 400));

    };


    if(req.body.password) {

        if(req.body.password !== req.body.rePassword) {

            return next(new API_Errors(`Password And rePassword Doesn't Match`, 400));
    
        };
    
    
    
        const hash = bcrypt.hashSync(req.body.password, 5);
        req.body.password = hash;
        req.body.rePassword = hash;

        user.changePasswordAt = Date.now();

    };



    if(req.file) {

        cloudinary.v2.uploader.upload(req.file,
        { public_id: "olympic_flag" }, 
        function(error, result) {

            if(error) {

                console.log(error);

            } else {

                console.log(result); 

            };

        });

    };



    if(req.body.phone) {

        if(!(req.body.phone).match(/^(010|011|012|015)[0-9]{8}$/)) {

            return next(new API_Errors("Please, Enter The Egyption Phone Valid", 400));

        };

    };



    if(req.body.email) {


        const token = jwt.sign({ 

            email: req.body.email
    
        }, process.env.SIGN_UP);
    
    
        sendConfirmEmail(req.body.email, user.name, token, req.protocol, req.headers.host);

        user.confirmEmail = false;

    };

    

    user = await userModel.findOneAndUpdate({email: req.user.email}, req.body , {new: true});

    if(req.body.email) {

        res.status(200).json({message: "Success Updated, Check Your Email To Confirm It", data: user});

    } else {

        res.status(200).json({message: "Success Updated", data: user});

    };


});










// Reset Password

export const resetPassword = ErrorHandler(async (req,res,next) => {

    const user = await userModel.findOne({email: req.body.email});

    if(!user) {

        return next(new API_Errors(`This Is User: ${req.body.email} Is Doesn't Exists`, 400));

    };


    const resetCode = parseInt(Math.random() * 1000000);

    const hash = bcrypt.hashSync(resetCode.toString(), 5);

    sendResetCode(user.email, user.name, resetCode);

    user.resetCode = hash;
    await user.save();


    const token = jwt.sign({ 

        email: user.email

    }, process.env.RESET_PASSWORD);



    res.status(200).json({message: "Success Send Reset Code", token});

});







// Confirm Reset Code 

export const confirmResetCode = ErrorHandler(async (req,res,next) => {


    jwt.verify(req.params.token, process.env.RESET_PASSWORD,async function(err, decoded) {
        
        if(err) {

            res.status(404).json({message: "Invalid Token", err});

        } else {

            const user = await userModel.findOne({email: decoded.email});

            if(!user) {

                return next(new API_Errors(`This Is User: ${decoded.email} Is Doesn't Exists`, 400));

            };

            const match = await bcrypt.compare(req.body.resetCode, user.resetCode);

            if(!match) {

                return next(new API_Errors(`Invalid Reset Code`, 400));

            };


            const token = jwt.sign({ 

                email: user.email
        
            }, process.env.CONFIRM_RESET_CODE);
        
        
        
            res.status(200).json({message: "Success Confirm Reset Code", token});


        };

    });

});







// Change Password After Confirm Reset Code

export const changePasswordAfterConfirm = ErrorHandler(async (req,res,next) => {


    jwt.verify(req.params.token, process.env.CONFIRM_RESET_CODE,async function(err, decoded) {
        
        if(err) {

            res.status(404).json({message: "Invalid Token", err});

        } else {

            const user = await userModel.findOne({email: decoded.email});

            if(!user) {

                return next(new API_Errors(`This Is User: ${decoded.email} Is Doesn't Exists`, 400));

            };


            if(!req.body.password && !req.body.rePassword) {

                return next(new API_Errors(`Not Found Password And rePassword`, 400));
        
            };


            if(req.body.password !== req.body.rePassword) {
        
                return next(new API_Errors(`Password And rePassword Doesn't Match`, 400));
        
            };
        
        
            const hash = bcrypt.hashSync(req.body.password, 5);
            user.password = hash;
            user.rePassword = hash;

            user.resetCode = undefined;

            user.changePasswordAt = Date.now();
        
            res.status(200).json({message: "Success Change Password, Try Login Now"});

        };

    });

});