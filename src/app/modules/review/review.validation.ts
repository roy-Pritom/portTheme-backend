import { z } from "zod";

const createReviewValidationSchema = z.object({
    body: z.object({
        courseId: z.string(),
        rating: z.number().min(1).max(5),
        review: z.string()
    })
})
const updateReviewValidationSchema = z.object({
    body: z.object({
        courseId: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        review: z.string().optional()
    })
})

export const reviewValidationSchemas = {
    createReviewValidationSchema,
    updateReviewValidationSchema
}