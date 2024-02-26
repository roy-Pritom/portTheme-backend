/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { userRole } from "./user.constant";

export type TUserRole=keyof typeof userRole;
export type TPasswordHistory={
  pass_word:string,
  timestamp: Date
}[];

export interface TUser{
    _id:string;
    username:string;
    email:string;
    password :string;
    passwordChangedAt?:Date;
    role:'user' | 'admin',
    passwordHistory?:TPasswordHistory,
}

export type TLoginUser={
    username:string;
    password :string;
}

export interface UserModel extends Model<TUser>{
  isUserExist(id:string):Promise<TUser>;
  isUserExistByUserName(username:string):Promise<TUser>;
  isJwtIssuedBeforePasswordChanged(passwordChangedTimestamp:Date,jwtIssuedTimestamp:number):boolean;
}