import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";
import { CategoryServices } from "./category.service";


// create category
const createCategory = catchAsyncError(async (req, res) => {
    const user=req.user;
    // console.log(user);
    const result = await CategoryServices.createCategoryInToDb(req.body,user);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Category created successfully",
        data: result
    })
})

// get all category
const getAllCategory = catchAsyncError(async (req, res) => {
    const result = await CategoryServices.getAllCategoryFromDb();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Categories retrieved successfully",
        data:{categories:result}
    })
})

export const CategoryControllers = {
    createCategory,
    getAllCategory
}

