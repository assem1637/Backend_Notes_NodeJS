import userModel from "./user.model.js";
import API_Errors from "../../Utils/APIErrors.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';







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