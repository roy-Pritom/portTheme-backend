// import { TEvent } from "./event.interface";
import { Event } from "./event.model";

// create category
const createEventInToDb = async (title:string, content:string, scheduledTime:Date) => {
 
    const result = await Event.create({title, content, scheduledTime});
    return result;
}

const publishDuePosts = async () => {
    const now = new Date();
    const duePosts = await Event.find({ scheduledTime: { $lte: now }, posted: false });
    duePosts.forEach(async (post) => {
      post.posted = true;
      await post.save();
      console.log(`Published post: ${post.title}`);
    });
  }

// // get all category
// const getAllCategoryFromDb = async () => {
//     const result = await Category.find().populate({
//         path:'createdBy',
//         select:'-createdAt -updatedAt -__v -passwordHistory'
//     });
//     return result;
// }

export const EventServices = {
    createEventInToDb,
    publishDuePosts
}