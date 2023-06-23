import mongoose from "mongoose";






const noteSchema = mongoose.Schema({


    userId: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "user"

    },


    title: {

        type: String,
        required: [true, "Title Of Note Is Required"],
        trim: true,
        minlength: [2, "2 Is The Lowest Title Of Note"],
        maxlength: [100, "100 Is The Largest Title Of Note"]

    },


    description: {

        type: String,
        required: [true, "Title Of Note Is Required"],
        trim: true,
        minlength: [10, "10 Is The Lowest Title Of Note"],
        maxlength: [1000, "1000 Is The Largest Title Of Note"]

    }


} , {timestamps: true});




const noteModel = mongoose.model("note", noteSchema);



export default noteModel;