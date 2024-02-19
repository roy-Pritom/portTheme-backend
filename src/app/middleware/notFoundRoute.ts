/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notFoundRoute=(req:Request,res:Response,next:NextFunction)=>{
    return res.status(404).json({
        success:false,
        statusCode:404,
        message:"Route note found!",
        err:""
    })
}

export default notFoundRoute;