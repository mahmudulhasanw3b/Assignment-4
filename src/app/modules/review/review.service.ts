import { Types } from 'mongoose';
import { TReview } from './review.interface';
import { Review } from './review.model';

const createReviewIntoDB = async (userId: string, payload: TReview) => {
    payload.createdBy = new Types.ObjectId(userId);
    const result = await Review.create(payload);
    return result;
};

const getReviewByCourseIdFromDB = async (courseId: string) => {
    const result = await Review.find({ courseId }).populate('createdBy');
    return result;
};

const getBestCourseFromDB = async () => {
    const result = await Review.aggregate([
        {
            $group: {
                _id: '$courseId',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 },
            },
        },
        {
            $sort: {
                averageRating: -1,
            },
        },
        {
            $limit: 1,
        },
        {
            $lookup: {
                from: 'courses',
                localField: '_id',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
    ]);
    return result[0];
};

export const ReviewServices = {
    createReviewIntoDB,
    getReviewByCourseIdFromDB,
    getBestCourseFromDB,
};
