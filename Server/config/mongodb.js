import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => { 
              console.log("Mongoose connected to DB");
        });   
        await mongoose.connect(`${process.env.MONGODB_URL}mern-auth`);
         
       
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

export default connectDB;