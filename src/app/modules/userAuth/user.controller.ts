import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
// register
const userRegister=catchAsyncError(async(req,res)=>{
    const result=await UserServices.userRegisterInToDb(req.body)
    sendResponse(res,{
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: result
    })
})
// login
const userLogin=catchAsyncError(async(req,res)=>{
    const result=await UserServices.userLoginInToDb(req.body)
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "User login successfully",
        data: result
    })
})

// change password
const changePassword=catchAsyncError(async(req,res)=>{
    const user=req.user;
    const result=await UserServices.changePasswordInToDb(user,req.body)
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Password changed successfully",
        data: result
    })
})

export const UserControllers={
    userRegister,
    userLogin,
    changePassword
}