import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";
import { EventServices } from "./event.service";
import cron from 'node-cron'
import moment from 'moment'



// create event
const createEvent = catchAsyncError(async (req, res) => {
    cron.schedule('* * * * *', () => {
        console.log('Checking for due posts...');
        EventServices.publishDuePosts();
      });
    const { title, content, scheduledTime } = req.body;
    const time=moment(scheduledTime).format("hh:mm:ss")
    const result = await EventServices.createEventInToDb(title, content, new Date(scheduledTime));
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: `Post scheduled successfully at ${time}`,
        data: result
    })
})



// // get all category
// const getAllCategory = catchAsyncError(async (req, res) => {
//     const result = await CategoryServices.getAllCategoryFromDb();
//     sendResponse(res, {
//         success: true,
//         statusCode: 200,
//         message: "Categories retrieved successfully",
//         data:{categories:result}
//     })
// })

export const EventControllers = {

   createEvent,

}

