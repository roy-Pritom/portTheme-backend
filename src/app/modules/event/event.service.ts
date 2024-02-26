
// import { TEvent } from "./event.interface";
import { Event } from "./event.model";


// import cron
import cron from 'node-cron'


// import insta instance
import { instaAcess } from './../../config/insta';

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



  // Define a separate async function for posting without a picture
  const postToInstagram = async (title, content) => {
    try {
        // Your posting logic here
        instaAcess.connectToInsta();
        const media = await instaAcess.ig.publish.photo({
          file:null,
            caption: `Title: ${title}\nContent: ${content}`,
        });
        console.log('Post successful:', media);
    } catch (error) {
        console.error('Error posting to Instagram:', error);
    }
};


  const schedulePost = (payload) => {
    const { title, content, scheduledTime } = payload;

    
    // Schedule the post at the specified time
    const cronTime = new Date(scheduledTime);
    
    const cronTimeString = `${cronTime.getMinutes()} ${cronTime.getHours()} ${cronTime.getDate()} ${cronTime.getMonth() + 1} *`;

    if(scheduledTime>Date.now()){
      //Schedule the post at the specified time using cron job
    cron.schedule(cronTimeString, () => {
      postToInstagram(title, content);
    });
    }
    


    return payload;
};


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
    publishDuePosts,
    schedulePost
}