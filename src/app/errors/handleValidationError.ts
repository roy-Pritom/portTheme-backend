import mongoose from "mongoose";
// handle mongoose validation error
const handleValidationError = (err: mongoose.Error.ValidationError) => {
    const errorMessage = Object.values(err?.errors).map((el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
        return `${el?.path} is required`
    }).join('.')
    return {
        statusCode: 400,
        message: "Validation error",
        errorMessage
    }
}

export default handleValidationError;