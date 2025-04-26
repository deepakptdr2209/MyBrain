import express from 'express'
import { contentSchema, LinkModel, UserModel } from './db';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { authCheck } from './middleware';
import { random } from './utils';
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

app.post('/api/v1/content', authCheck, async (req, res)=>{
    const link = req.body.link;
    const type = req.body.type;
    const userId = req.userId;
    const title = req.body.title
    // console.log(req.body)
     console.log(req.userId)
    // add to db
    try {
        await contentSchema.create({
            link,
            type,
            userId,
            title  ,
            tags: []
        })
        res.status(201).json({
            message : " content added"
        })
        
    } catch (error) {
        res.status(500).json({
            message : "eroor occured "
        })
    }
       
   
})

// get content 
app.get('/api/v1/content',authCheck, async (req, res)=>{
    const userId = req.userId;
    console.log(userId)
    try {
        const content = await contentSchema.find({
            userId: userId
        }).populate("userId","username")
        console.log("content :", content)
        res.json({
            content
        })
    } catch (error) {
        res.status(403).json({
            message : "not found"
        })
    }
})

app.delete("./api/v1/content",authCheck,async (req, res)=>{
    const contentId= req.body.contentId;
    try {
        await contentSchema.deleteMany({
            contentId,
            userId : req.userId
         })
         res.json({
            message: "Deleted"
        })
    } catch (error) {
        res.status(500).json({
            message : " error while deleting"
        })
    }
})

app.post('/api/v1/brain/share', authCheck, async (req,res)=>{
    const share = req.body.share;
    // {share : true/false }
    if(share){
        const existingUser = await LinkModel.findOne({
            userId : req.userId
        })
        if(existingUser){
            res.json({
                hash: existingUser.hash
            })
            return;
        }
        const hash = random(10);
        await LinkModel.create({
            userId : req.userId,
            hash: hash
        })
        res.json({
            hash
        })
    }else{
        await LinkModel.deleteOne({
            userId : req.userId
        })
        res.json({
            message : " link deleted"
        })
    }
})

app.get('/api/v1/brain/:shareLink', authCheck
    , async (req,res)=>{
        const hash = req.params.shareLink;

        const link = await LinkModel.findOne({
            hash
        })
        if(!link){
            res.json({
                message : " oops! link is invalid"
            })
            return;
        }
        const content = await contentSchema.find({
            userId : link.userId
        })
        const user = await UserModel.findOne({
            _id : link.userId
        })
        if(!user){
            res.status(411).json({
                message : " user not found"
            })
            return;
        }
        
        res.json({
            username : user.username,
            content : content
        })

    }
)
 
app.listen(3000);