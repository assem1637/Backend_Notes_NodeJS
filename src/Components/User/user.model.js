import mongoose from 'mongoose';



const validationPhone = (Phone) => {

    if(Phone.match(/^(010|011|012|015)[0-9]{8}$/)) {

        return true;

    } else {

        return false;

    };

};




const userSchema = mongoose.Schema({


   name: {

        type: String,
        required: [true, "Name Of User Is Required"],
        trim: true,
        minlength: [3, "3 Is The Lowest Name Of User"],
        maxlength: [50, "50 Is The Largest Name Of User"],
        lowercase: true

   },



   age: {

        type: Number,
        required: [true, "Age Of User Is Required"],
        min: [5, "5 Is The Lowest Age Of User"],
        max: [120, "120 Is The Largest Age Of User"]

   },



   email: {

        type: String,
        required: [true, "Email Of User Is Required"],
        trim: true,
        lowercase: true

   },


   gender: {

        type: String,
        required: [true, "Gender Of User Is Required"],
        enum: ["male", "female"]

   },


   confirmEmail: {

        type: Boolean,
        default: false

   },



   password: {

        type: String,
        required: [true, "Password Of User Is Required"],
        minlength: [6, "6 Is The Lowest Password Of User"],
        maxlength: [100, "100 Is The Largest Password Of User"]

   },


   rePassword: {

        type: String,
        required: [true, "rePassword Of User Is Required"],
        minlength: [6, "6 Is The Lowest rePassword Of User"],
        maxlength: [100, "100 Is The Largest rePassword Of User"]   

   },



   phone: {

        type: String,
        required: [true, "Phone Of User Is Required"],
        trim: true,
        validate: [validationPhone, "Please, Enter The Egyption Phone Valid"]

   },



   isActive: {

        type: Boolean,
        default: true

   },



   profilePicture: {

        type: String

   }


}, {timestamps: true});




const userModel = mongoose.model("user", userSchema);




export default userModel;