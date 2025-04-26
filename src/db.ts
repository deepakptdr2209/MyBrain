import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv"
dotenv.config();
mongoose.connect(process.env.DATABASE_URL as string)
console.log("Database URL:", process.env.DATABASE_URL);
const UserSchema = new Schema({
    username : {
        type : String,
        required: true
    },
    password : String
}) 

export const UserModel = model("User",UserSchema);
const contentType = ['image','video','article','audio']
const ContentSchema = new Schema({
    link :{
        type:String,
        required:true
    } ,
    title : {
        type: String,
    required : true
    },
    type : {
        type: String,
        enum: contentType,
        required : true
    },
    userId : {
      type : mongoose.Types.ObjectId,
      ref : 'User',
      required : true
      
    },
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
})
export const contentSchema = model('Content',ContentSchema)

const TagSchema = new Schema({
    title : {
        type : String,
        required : true,
        unique : true
    }
})
export const tagSchema = model('Tag',TagSchema)

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
})

export const LinkModel = model("Links", LinkSchema);
