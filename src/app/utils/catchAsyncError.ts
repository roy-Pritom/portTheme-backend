import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsyncError = (fun: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fun(req, res, next)).catch(err => next(err))
    }
}

export default catchAsyncError;