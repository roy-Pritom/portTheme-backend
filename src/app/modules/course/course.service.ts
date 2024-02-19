/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import MyAppError from "../../errors/AppError";
import { Review } from "../review/review.model";
import { TCourse } from "./course.interface"
import { Course } from "./course.model"
import mongoose from "mongoose";

// create course with duration week
const createCourseIntoDb = async (payload: TCourse,user:JwtPayload) => {
   // set up duration week
   const start: Date = new Date(payload?.startDate);
   const end: Date = new Date(payload?.endDate);
   // console.log(start.getTime(),end.getTime());
   const milliSecondesInWeek = 7 * 24 * 60 * 60 * 1000;
   payload.durationInWeeks = Math.ceil((end.getTime() - start.getTime()) / milliSecondesInWeek)
   payload.createdBy=user?._id;
   const result = await Course.create(payload);
   return result;
}


// Get Paginated and Filtered Courses. 
const getAllCourseFromDb = async (params: Record<string, unknown>) => {
   const pipeline: any = [];
   const match: any = {};
   if (params?.minPrice || params?.maxPrice) {
      match.price = {
         $gte: parseFloat(params?.minPrice as string) || 0,
         $lte: parseFloat(params?.maxPrice as string) || Infinity
      }
   }
   if (params?.startDate || params?.endDate) {
      match.startDate = {
         $gte: new Date(params?.startDate as string || "1900-01-01"),
         $lte: new Date(params?.endDate as string || "2999-12-31")
      }
   }
   // language filter
   if (params?.language) {
      match.language = {
         $eq: params?.language
      }
   }
   // provider filter
   if (params?.provider) {
      match.provider = {
         $eq: params?.provider
      }
   }
   // durationInWeeks filter
   if (params?.durationInWeeks) {
      match.durationInWeeks = {
         $eq: parseInt(params?.durationInWeeks as string)
      }
   }

   // tags filter
   if (params?.tags) {
      match.tags = {
         $elemMatch: { name: params?.tags as string, isDeleted: false }
      }
   }

   // level filter
   if (params?.level) {
      match['details.level'] = params?.level as string;
   }

   pipeline.push({ $match: match })

   pipeline.push({
      $lookup: {
          from: 'users',  // Assuming the collection name is 'users'. Adjust if different.
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
          //   for specific users data
          pipeline:[
            {
               $project:{
                  password:0,
                  createdAt:0,
                  updatedAt:0,
                  passwordHistory:0,
                  __v:0
               }
            }
          ]
      }
  })
  pipeline.push({ $unwind: '$createdBy' });
 
     // sort
   if (params?.sortBy) {
      const sort: any = {};
      sort[params?.sortBy as string] = params?.sortOrder === 'desc' ? -1 : 1;
      pipeline.push({ $sort: sort });
   }
const total=await Course.countDocuments(match)
   // create pagination
   const page = parseInt(params?.page as string) || 1;
   const limit = parseInt(params?.limit as string) || 10;
   const skip = (page - 1) * limit;

   pipeline.push({ $skip: skip });
   pipeline.push({ $limit: limit });
   const result = await Course.aggregate(pipeline);
   return {result,total};
}


// Get Course by ID with Reviews
const getSingleCourseWithReviewsFromDb = async (courseId: string) => {
   await Course.isCourseExists(courseId)
   const course = await Course.findById(courseId).populate({
      path:'createdBy',
      select:'-createdAt -updatedAt -__v -passwordHistory'
   });
   const reviews = await Review.find({ courseId }).populate({
      path:'createdBy',
      select:'-createdAt -updatedAt -__v -passwordHistory -passwordChangedAt'
   })
   return { course, reviews };
}


// Get the Best Course Based on Average Review (Rating)
const getBestCourseFromDb = async () => {
   const result = await Course.aggregate([
      {
         $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'courseId',
            as: 'reviews'
         }
      },
      {
         $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy',
            pipeline:[{
               $project:{
                  password:0,
                  createdAt:0,
                  updatedAt:0,
                  passwordHistory:0,
                  __v:0
               }
            }]

         }
      },
      {$unwind:'$createdBy'},
      {
         $project: {
            course: "$$ROOT",
            averageRating: { $avg: '$reviews.rating' },
            reviewCount: { $size: '$reviews' }
         }
      },
      { $sort: { averageRating: -1, reviewCount: -1 } },
      { $limit: 1 },
      {
         $project: {
            _id: 0,
            course: {
               _id: '$course._id',
               title: '$course.title',
               instructor: '$course.instructor',
               categoryId: '$course.categoryId',
               price: '$course.price',
               tags: '$course.tags',
               startDate: '$course.startDate',
               endDate: '$course.endDate',
               language: '$course.language',
               provider: '$course.provider',
               durationInWeeks: '$course.durationInWeeks',
               details: '$course.details',
               createdBy:'$course.createdBy',
               createdAt:'$course.createdAt',
               updatedAt:'$course.updatedAt'
            },
            averageRating: 1,
            reviewCount: 1
         }
      }
   ]);
   return result[0] || null;
};


// update course (Partial Update with Dynamic Update)
const updateCourseInToDb = async (id: string, payload: Partial<TCourse>) => {
   const { tags, details, ...remainingData } = payload;
   const modifiedData: Record<string, unknown> = { ...remainingData };
   await Course.isCourseExists(id)

   // transaction roll back
   const session = await mongoose.startSession();
   try {
      session.startTransaction()
      //details
      if (details && Object.keys(details).length) {
         for (const [key, value] of Object.entries(details)) {
            modifiedData[`details.${key}`] = value;
         }
      }

      const updateCourse = await Course.findByIdAndUpdate(id, modifiedData, {
         new: true,
         runValidators: true,
         session
      })
      if (!updateCourse) {
         throw new MyAppError(400, 'Course updated failed', 'update error')
      }

      if (tags && tags.length > 0) {
         // check isDeleted=== false ad filter and pull
         const deletedTags = tags.filter(el => el.isDeleted).map(el => el.name)
         const deletedCourseTag = await Course.findByIdAndUpdate(id,
            {
               $pull: { tags: { name: { $in: deletedTags } } }
            },
            {
               new: true,
               runValidators: true,
               session

            }
         )
         if (!deletedCourseTag) {
            throw new MyAppError(400, 'Course updated failed', 'update error')
         }
         //  check isDeleted=== true and filter and addToSet
         const addCourseTags = tags.filter(el => !el.isDeleted);
         const newCourseTag = await Course.findByIdAndUpdate(id,
            {
               $addToSet: { tags: { $each: addCourseTags } }
            },
            {
               new: true,
               runValidators: true,
               session
            }
         )
         // check error
         if (!newCourseTag) {
            throw new MyAppError(400, 'Course updated failed', 'update error')

         }

      }
      await session.commitTransaction();
      await session.endSession()

      const result = await Course.findById(id).populate({
         path:'createdBy',
         select:'-createdAt -updatedAt -__v -passwordHistory'
      });

      return result;
   } catch (err) {
      await session.abortTransaction();
      await session.endSession();
      throw new MyAppError(400, 'Course updated failed', 'update error')

   }


}

export const CourseServices = {
   createCourseIntoDb,
   getAllCourseFromDb,
   getSingleCourseWithReviewsFromDb,
   getBestCourseFromDb,
   updateCourseInToDb
}