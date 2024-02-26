import httpStatus from "http-status";
import MyAppError from "../../errors/AppError";
import { TLoginUser, TPasswordHistory, TUser } from "./user.interface"
import { User } from "./user.model";
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from "../../config";

const userRegisterInToDb = async (payload: TUser) => {
    const result = await User.create(payload)
    const userWithOutPassword = await User.findById(result._id).select('-password -passwordHistory -__v').lean();
    return userWithOutPassword;
}


const userLoginInToDb = async (payload: TLoginUser) => {

    // check user exist or not
    const user = await User.isUserExistByUserName(payload?.username);

    if (!user) {
        throw new MyAppError(httpStatus.NOT_FOUND, 'user not exist', 'Not found error')
    }

    // check password
    const isPasswordMatched = await bcrypt.compare(payload?.password, user?.password)
    if (!isPasswordMatched) {
        throw new MyAppError(httpStatus.FORBIDDEN, 'password do not matched!', 'FORBIDDEN')
    }

    const jwtTokenPayload = {
        _id: user?._id,
        role: user?.role,
        email: user?.email
    }

    const accessToken = jwt.sign(jwtTokenPayload, config.access_secret as string, { expiresIn: '15d' });

    const userWithOutPassword = await User.findById(user._id).select('-password -passwordChangedAt -passwordHistory -__v').lean();

    return {
        user: userWithOutPassword,
        token: accessToken
    }

}


const changePasswordInToDb = async (userData: JwtPayload, payload: {
    currentPassword: string, newPassword: string
}) => {
    // check user exist or not
    const user = await User.isUserExist(userData?._id);
    if (!user) {
        throw new MyAppError(httpStatus.NOT_FOUND, 'user not exist', 'Not found error')
    }

    // check password
    const isPasswordMatched = await bcrypt.compare(payload?.currentPassword, user?.password)
    if (!isPasswordMatched) {
        throw new MyAppError(httpStatus.FORBIDDEN, 'password do not matched!', 'FORBIDDEN')
    }

    // hash new password
    const newHashPassword=await bcrypt.hash(payload?.newPassword,Number(config.bcrypt_salt)) 


    const passwordHistory=user?.passwordHistory as TPasswordHistory
    const isOldPassword = passwordHistory.some(item => bcrypt.compareSync(payload.newPassword,item.pass_word));

    if (bcrypt.compareSync(payload.newPassword, user.password) || isOldPassword) {
        throw new MyAppError(httpStatus.FORBIDDEN, 'Password change failed. Ensure the new password is unique and not among the last 2 used (last used on 2023-01-01 at 12:00 PM).', 'FORBIDDEN');
    }



   const result=await User.findOneAndUpdate({
        _id:userData?._id,
        role:userData?.role
    },
    {
        password:newHashPassword,
        passwordChangedAt:new Date(),
        $push: { passwordHistory: { $each: [{ pass_word: user.password, timestamp: new Date() }], $slice: -2 } },
        
    },
    {
        new:true   
    }
    ).select('-passwordChangedAt -passwordHistory -__v')

    return result;
}

export const UserServices = {
    userRegisterInToDb,
    userLoginInToDb,
    changePasswordInToDb
}