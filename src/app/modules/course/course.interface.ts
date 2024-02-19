import { Model, Types } from "mongoose";


export type TDetails={
    level : "Beginner"| "Intermediate"| "Advanced";
    description :string;
}

export type TTags={
    name:string;
    isDeleted?:boolean;
}

export type TCourse={
    title:string;
    instructor :string;
    categoryId :Types.ObjectId;
    price :number;
    tags:[TTags];
    startDate :string;
    endDate :string;
    language :string;
    provider :string;
    durationInWeeks:number;
    details :TDetails;
    createdBy:Types.ObjectId;
}

// static method
export interface CourseModel extends Model<TCourse> {
    // eslint-disable-next-line no-unused-vars
    isCourseExists(id:string): Promise<TCourse | null>;
}