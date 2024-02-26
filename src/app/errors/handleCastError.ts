import mongoose from "mongoose";
// handle cast error
const handleCastError = (err: mongoose.Error.CastError) => {
    const errorMessage = `${err?.value} is not a valid ID!`
    return {
        statusCode: 400,
        message: "Invalid ID",
        errorMessage
    }
}

export default handleCastError;