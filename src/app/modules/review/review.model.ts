import { model, Schema } from 'mongoose';
import { TReview } from './review.interface';
import { Course } from '../course/course.model';
import status from 'http-status';
import AppError from '../../errors/AppError';

const reviewSchema = new Schema<TReview>(
    {
        courseId: { type: Schema.Types.ObjectId, required: true },
        rating: { type: Number, required: true },
        review: { type: String, required: true },
        createdBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    },
);

reviewSchema.pre('save', async function (next) {
    const isCourseExists = await Course.findById(this.courseId);
    if (!isCourseExists) {
        throw new AppError(
            status.NOT_FOUND,
            'courseId not Found',
            `${this.courseId} does not exists in course`,
        );
    }
    next();
});

export const Review = model<TReview>('Review', reviewSchema);
