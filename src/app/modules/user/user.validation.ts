import { z } from 'zod';
import { userRoles } from './user.constant';

const createUserValidationSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum(userRoles as [string, ...string[]]),
});

export const UserValidations = {
    createUserValidationSchema,
};
