import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import { Role } from "./user.constant";
import bcrypt from 'bcrypt';
import config from "../../config";

const userSchema = new Schema<TUser,UserModel>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select:0
    },
    passwordChangedAt:{
        type:Date
    },
    role: {
        type: String,
        enum:Role,
        default: 'user'
    },
    passwordHistory: [{
        pass_word: String,
        timestamp: Date
    }],
},{
    timestamps:true
});

// pre save middleware
// hash password
userSchema.pre('save',async function(next){
this.password=await bcrypt.hash(this.password,Number(config.bcrypt_salt));
next();
})

// post save middleware
userSchema.post('save',function(doc,next){
    doc.password='';
    next();
})

// user is exist or not static
userSchema.statics.isUserExist=async function(id:string){
    return await User.findById(id).select('+password')
}
// user is exist or not static
userSchema.statics.isUserExistByUserName=async function(username:string){
    return await User.findOne({username}).select('+password')
}

// if password change then invalid token
userSchema.statics.isJwtIssuedBeforePasswordChanged=function(passwordChangedTimestamp:Date,jwtIssuedTimestamp:number){
  const passwordChangedTime=new Date(passwordChangedTimestamp).getTime()/1000;

  return passwordChangedTime>jwtIssuedTimestamp
}

export const User=model<TUser,UserModel>('User',userSchema)