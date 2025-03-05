import z from 'zod';

const createTagValidationSchema = z.object({
    name: z.string(),
    isDeleted: z.boolean().default(false),
});

const updateTagValidationSchema = z.object({
    name: z.string().optional(),
    isDeleted: z.boolean().default(false),
});

const createDetailsValidationSchema = z.object({
    level: z.string(),
    description: z.string(),
});

const updateDetailsValidationSchema = z.object({
    level: z.string().optional(),
    description: z.string().optional(),
});

const createCourseValidationsSchema = z.object({
    title: z.string(),
    instructor: z.string(),
    categoryId: z.string(),
    price: z.number(),
    tags: createTagValidationSchema.array(),
    startDate: z.string(),
    endDate: z.string(),
    language: z.string(),
    provider: z.string(),
    details: createDetailsValidationSchema,
});

const updateCourseValidationsSchema = z.object({
    title: z.string().optional(),
    instructor: z.string().optional(),
    categoryId: z.string().optional(),
    price: z.number().optional(),
    tags: updateTagValidationSchema.array().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    language: z.string().optional(),
    provider: z.string().optional(),
    details: updateDetailsValidationSchema.optional(),
});

export const CourseValidations = {
    createCourseValidationsSchema,
    updateCourseValidationsSchema,
};
