/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import handleCastError from "../errors/handleCastError";
import handleValidationError from "../errors/handleValidationError";
import handleDuplicateError from "../errors/handleDuplicateError";
import MyAppError from "../errors/AppError";
import httpStatus from "http-status";
import config from "../config";

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500;
    let message = "Something went wrong" || err?.message;

    let errorMessage = err?.message || ''
    // handle zod validation error
    if (err instanceof ZodError) {
        const customizeError = handleZodError(err);
        errorMessage = customizeError.errorMessage
        message = customizeError.message
        statusCode = customizeError.statusCode
    }
    // handle cast error
    else if (err?.name === 'CastError') {
        const customizeError = handleCastError(err);
        errorMessage = customizeError.errorMessage
        message = customizeError.message
        statusCode = customizeError.statusCode
    }
    // handle mongoose validation error
    else if (err?.name === 'ValidationError') {
        const customizeError = handleValidationError(err);
        errorMessage = customizeError.errorMessage
        message = customizeError.message
        statusCode = customizeError.statusCode
    }
    // handle duplicate key error
    else if (err?.code ===11000) {
        const customizeError = handleDuplicateError(err);
        errorMessage = customizeError.errorMessage
        message = customizeError.message
        statusCode = customizeError.statusCode
    }
    else if (err instanceof MyAppError) {
        errorMessage =err.message;
        message =err.errMessage;
        statusCode =err.statusCode;
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errorMessage,
        errorDetails:err.statusCode===(httpStatus.UNAUTHORIZED)?null:err,
        stack: err.statusCode===(httpStatus.UNAUTHORIZED) || config.node_env==='production'?null:err.stack
    })


}

export default globalErrorHandler;