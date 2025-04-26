import { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv'

import jwt, { JwtPayload } from 'jsonwebtoken'
import mongoose from "mongoose";
dotenv.config();
export const authCheck = (req:Request,res:Response,next:NextFunction)=>{
    const header = req.headers["authorization"]
    const decoded = jwt.verify(header as string,process.env.JWT_SECRET as string)
   // console.log(decoded)
    if(decoded){
        if(typeof decoded === 'string'){
            res.status(401).json({
                message:"you are not logged in"
            })
            return;
        }
        req.userId  =  (decoded as JwtPayload).id;
        next()
    } else {
        res.status(403).json({
            message: "You are not logged in"
        })
    }
   
}