import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ReviewServices } from './review.service';
import sendResponse from '../../utils/sendResponse';

const createReview = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const result = await ReviewServices.createReviewIntoDB(userId, req.body);
    sendResponse(res, {
        statusCode: status.CREATED,
        message: 'Review created successfully',
        data: result,
    });
});

export const ReviewControllers = {
    createReview,
};
