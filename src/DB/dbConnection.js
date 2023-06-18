import mongoose from "mongoose";




const dbConnection = () => {

    mongoose.connect(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.jxdqfgq.mongodb.net/notes`).then(()=> {

        console.log("DB Connection Successfully");

    }).catch((err) => {

        console.log(err);

    });

};



export default dbConnection;