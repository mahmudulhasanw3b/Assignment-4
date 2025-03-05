import { z } from 'zod';

const loginValidationSchema = z.object({
    username: z.string(),
    password: z.string(),
});

const changePasswordValidationSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string(),
});

export const AuthValidations = {
    loginValidationSchema,
    changePasswordValidationSchema,
};
