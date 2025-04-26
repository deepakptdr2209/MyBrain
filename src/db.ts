import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv"
dotenv.config();
mongoose.connect(process.env.DATABASE_URL as string)
console.log("Database URL:", process.env.DATABASE_URL);
const UserSchema = new Schema({
    username : {
        type : String,
        require: true
    },
    password : String
}) 

export const UserModel = model("User",UserSchema)