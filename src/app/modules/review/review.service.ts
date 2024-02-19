import { JwtPayload } from "jsonwebtoken";
import { TReview } from "./review.interface";
import { Review } from "./review.model";

// create review
const createReviewInToDb = async (payload: TReview,user:JwtPayload) => {
    payload.createdBy=user?._id
    const result = (await Review.create(payload)).populate({
        path:'createdBy',
        select:'-createdAt -updatedAt -__v -passwordHistory -passwordChangedAt'
    });
    return result;
}

export const ReviewServices = {
    createReviewInToDb
} 