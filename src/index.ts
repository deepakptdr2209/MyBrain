import express from 'express'
import { UserModel } from './db';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
const app = express();
app.use(express.json())

app.post('/api/v1/signup',async (req ,res)=>{
    const {username, password} = req.body;
    try {
        await UserModel.create({
            username : username ,
            password : password
        })

        res.json({
            message: "User created"
        })
    } catch (error) {
        res.status(411).json({
            message: "User already exists"
        })
    }
})

app.post('/api/v1/signin', async (req,res)=>{
    const {username, password} = req.body;
    try {
        const existingUser = await UserModel.findOne({
            username,
            password
        })
        if(existingUser){
           const token = jwt.sign({id:existingUser._id},process.env.JWT_SECRET as string);
           res.json({
            token
        })
        }
       else{
        res.status(403).json({
            message : "user not found"
        })
       }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('An unknown error occurred');
        }
        res.status(403).json({
            message : "invalid User"
        })
    }
})


app.listen(3000);