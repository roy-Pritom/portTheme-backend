import { z } from 'zod';

const userValidationSchema = z.object({
    body: z.object({
        username: z.string({'required_error':'username is required'}).min(3).max(50),
        email: z.string({'required_error':'email is required'}).email(),
        password:z.string().min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[a-z]/, { message: "Password must include at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
        .regex(/\d/, { message: "Password must include at least one number" })
        .regex(/[@$!%*?&]/, { message: "Password must include at least one special character" }),
        role: z.enum(['user', 'admin']).default('user')
    })
});
const userLoginValidationSchema = z.object({
    body: z.object({
        username: z.string({'required_error':'username is required'}),
        password: z.string({'required_error':'password is required'})
    })
});
const passwordChangedValidationSchema = z.object({
    body: z.object({
        currentPassword:z.string({'required_error':'current password is required'}),
        newPassword: z.string().min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[a-z]/, { message: "Password must include at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
        .regex(/\d/, { message: "Password must include at least one number" })
        .regex(/[@$!%*?&]/, { message: "Password must include at least one special character" })
    })
});

export const UserValidationSchemas={
    userValidationSchema,
    userLoginValidationSchema,
    passwordChangedValidationSchema
}




