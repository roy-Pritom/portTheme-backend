import { Schema, model } from "mongoose";
import { CourseModel, TCourse, TDetails, TTags } from "./course.interface";
import MyAppError from "../../errors/AppError";



const tagsSchema=new Schema<TTags>({
    name:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

const detailsSchema=new Schema<TDetails>({
    level:{
        type:String,
        enum:['Beginner', 'Intermediate', 'Advanced'],
        required:true
    },
    description:{
        type:String,
        required:true
    },
})

const courseSchema=new Schema<TCourse,CourseModel>({
    title:{
        type:String,
        unique:true,
        required:true
    },
    instructor :{
        type:String,
        required:true
    },
    categoryId :{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    price :{
        type:Number,
        required:true
    },
    tags:{
        type:[tagsSchema],
        required:true
    },
    startDate :{
        type:String,
        required:true
    },
    endDate :{
        type:String,
        required:true
    },
    language :{
        type:String,
        required:true
    },
    provider :{
        type:String,
        required:true
    },
    durationInWeeks:{
        type:Number,
        required:true
    },
    details :{
        type:detailsSchema,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
})

// static method
courseSchema.statics.isCourseExists = async function (id: number) {
    const existCourse = await Course.findById(id)
    if (!existCourse) {
        const error = new MyAppError(404,"Course not found!",`${id} Not Found`);
        throw  error
    }
    return existCourse;
}


export const Course=model<TCourse,CourseModel>('Course',courseSchema);