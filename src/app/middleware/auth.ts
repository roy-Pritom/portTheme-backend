import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../utils/catchAsyncError";
import { TUserRole } from "../modules/userAuth/user.interface";
import MyAppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from "../config";
import { User } from "../modules/userAuth/user.model";

const auth = (...roles: TUserRole[]) => {
    return catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

        const token = req.headers.authorization;

        if (!token) {
            throw new MyAppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access', 'You do not have the necessary permissions to access this resource.')
        }

        const decoded = jwt.verify(token, config.access_secret as string) as JwtPayload;
        // console.log(decoded);
        const { _id, role, iat } = decoded

        // check user exist or not
        const userData = await User.isUserExist(_id);

        if (!userData) {
            throw new MyAppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access', 'You do not have the necessary permissions to access this resource.')
        }

        // for password change invalid the previous token
        if (userData?.passwordChangedAt && User.isJwtIssuedBeforePasswordChanged(userData.passwordChangedAt, iat as number)) {
            throw new MyAppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access', 'You do not have the necessary permissions to access this resource.')
        }

        if (roles && !roles.includes(role)) {
            throw new MyAppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access', 'You do not have the necessary permissions to access this resource.')
        }

        req.user = decoded;

        next();
    })
}

export default auth;