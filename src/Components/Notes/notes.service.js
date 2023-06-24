import noteModel from "./notes.model.js";
import userModel from "../User/user.model.js"; 
import API_Errors from "../../Utils/APIErrors.js";










// Handle Errors

const ErrorHandler = (fun) => {

    return (req,res,next) => {

        fun(req,res,next).catch((err) => {

            return next(new API_Errors(err.message, 404));

        });

    };

};









// Get All Notes For User

export const getAllNotesOfUser = ErrorHandler(async (req,res,next) => {

    const user = await userModel.findOne({ email: req.user.email });

    if(!user) {

        return next(new API_Errors(`This Is User: ${req.user.email} Is Doesn't Exists`, 400));

    };


    const notesOfUser = await noteModel.find({ userId: user._id });

    res.status(200).json({message: "Success", data: notesOfUser});

});







// Create New Note

export const createNewNote = ErrorHandler(async (req,res,next) => {

    const user = await userModel.findOne({ email: req.user.email });

    if(!user) {

        return next(new API_Errors(`This Is User: ${req.user.email} Is Doesn't Exists`, 400));

    };


    req.body.userId = user._id;


    const newNote = noteModel(req.body);
    await newNote.save();


    res.status(200).json({message: "Success", data: newNote});

});








// Get Specific Note By ID

export const getSpecificNote = ErrorHandler(async (req,res,next) => {

    const user = await userModel.findOne({ email: req.user.email });

    if(!user) {

        return next(new API_Errors(`This Is User: ${req.user.email} Is Doesn't Exists`, 400));

    };



    const note = await noteModel.findOne({ _id: req.params.id });

    if(!note) {

        return next(new API_Errors(`Not Found Note`, 400));

    };


    res.status(200).json({message: "Success", data: note});

});








// Update Specific Note

export const updateSpecificNote = ErrorHandler(async (req,res,next) => {

    const user = await userModel.findOne({ email: req.user.email });

    if(!user) {

        return next(new API_Errors(`This Is User: ${req.user.email} Is Doesn't Exists`, 400));

    };


    const note = await noteModel.findOneAndUpdate({ _id: req.params.id }, req.body, {new: true});

    if(!note) {

        return next(new API_Errors(`Not Found Note`, 400));

    };


    res.status(200).json({message: "Success Updated", data: note});

});








// Delete Specific Note

export const deleteSpecificNote = ErrorHandler(async (req,res,next) => {

    const user = await userModel.findOne({ email: req.user.email });

    if(!user) {

        return next(new API_Errors(`This Is User: ${req.user.email} Is Doesn't Exists`, 400));

    };


    const note = await noteModel.findOneAndDelete({ _id: req.params.id });

    if(!note) {

        return next(new API_Errors(`Not Found Note`, 400));

    };


    res.status(200).json({message: "Success Deleted", data: note});

});