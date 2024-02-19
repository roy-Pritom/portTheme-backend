import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from "./review.service";

// create review
const createReview = catchAsyncError(async (req, res) => {
    const result = await ReviewServices.createReviewInToDb(req.body,req.user);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Review created successfully",
        data: result
    })
})


export const ReviewControllers = {
    createReview
}