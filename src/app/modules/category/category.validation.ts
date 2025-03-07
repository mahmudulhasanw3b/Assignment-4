import z from 'zod';

const categoryValidationSchema = z.object({
    name: z.string(),
});

export const CategoryValidations = {
    categoryValidationSchema,
};
