import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";
import { CourseServices } from "./course.service";

// create course
const createCourse = catchAsyncError(async (req, res) => {
    const result = await CourseServices.createCourseIntoDb(req.body,req.user);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Course created successfully",
        data: result
    })
})
// get all course
const getAllCourse = catchAsyncError(async (req, res) => {
    const {result,total} = await CourseServices.getAllCourseFromDb(req.query);
    const page=parseInt(req.query.page as string) || 1;
    const limit=parseInt(req.query.limit as string) || 10;
    
    res.status(200).json({
        success: true,
        statusCode: 200,
        meta: {
            page:page,
            limit: limit,
            total:total
        },
        message: "Courses retrieved successfully",
        data:{courses:result}
    })

        
    
})
// get course by id
const getSingleCourseWithReviews = catchAsyncError(async (req, res) => {
    const { courseId } = req.params;
    const result = await CourseServices.getSingleCourseWithReviewsFromDb(courseId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Course and Reviews retrieved successfully",
        data: result
    })
})

// get best course with avg rating
const getBestCourse = catchAsyncError(async (req, res) => {
    const result = await CourseServices.getBestCourseFromDb()
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Best course retrieved successfully",
        data: result
    })
})

// update course
const updateCourse = catchAsyncError(async (req, res) => {
  const {courseId}=req.params;
    const result = await CourseServices.updateCourseInToDb(courseId,req.body)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Course updated successfully",
        data: result
    })
})

export const CourseControllers = {
    createCourse,
    getAllCourse,
    getSingleCourseWithReviews,
    getBestCourse,
    updateCourse
}