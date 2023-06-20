import mongoose from "mongoose";




const dbConnection = () => {

    mongoose.connect(process.env.DATABASE).then(()=> {

        console.log("DB Connection Successfully");

    }).catch((err) => {

        console.log(err);

    });

};



export default dbConnection;