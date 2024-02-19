import { ZodError, ZodIssue } from "zod";
// handle zod validation error
const handleZodError=(err:ZodError)=>{
const errorMessage=err.issues.map((el:ZodIssue)=>{
    return `${el?.path[1]} is required`
}).join('.')
return {
    statusCode:400,
    message:"Validation error",
    errorMessage
}
}

export default handleZodError;