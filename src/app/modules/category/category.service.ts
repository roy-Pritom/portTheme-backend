import { JwtPayload } from "jsonwebtoken";
import { TCategory } from "./category.interface"
import { Category } from "./category.model"

// create category
const createCategoryInToDb = async (payload: TCategory,user:JwtPayload) => {
    payload.createdBy=user._id
    const result = await Category.create(payload);
    return result;
}

// get all category
const getAllCategoryFromDb = async () => {
    const result = await Category.find().populate({
        path:'createdBy',
        select:'-createdAt -updatedAt -__v -passwordHistory'
    });
    return result;
}

export const CategoryServices = {
    createCategoryInToDb,
    getAllCategoryFromDb
}