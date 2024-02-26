import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";
import { EventServices } from "./event.service";
// import cron from 'node-cron'
import moment from "moment";


const createEvent = catchAsyncError(async (req, res) => {
//   const { title, content, scheduledTime } = req.body;
const title="Sample Scheduled Post2";
const content="This is a sample post that has been scheduled to be published automati…";
const scheduledTime= "2024-02-23T21:30:04.776+00:00"
  // convert schedule time to required time format
  const time = moment(scheduledTime).format("hh:mm:ss");
  const result = await EventServices.createEventInToDb(
    title,
    content,
    new Date(scheduledTime)
  );

  if (result) {
    // schedule the post
    await EventServices.schedulePost(result);

    return sendResponse(res, {
      success: true,
      statusCode: 201,
      message: `Post scheduled successfully at ${time}`,
      data: result,
    });
  }

  return sendResponse(res, {
    success: false,
    statusCode: 500,
    message: `Post scheduled unSuccessful at ${time}`,
    data: "",
  });
});

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
};
