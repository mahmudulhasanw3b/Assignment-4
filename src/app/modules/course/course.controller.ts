import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';
import { ReviewServices } from '../review/review.service';
import AppError from '../../errors/AppError';

const createCourse = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const result = await CourseServices.createCourseIntoDB(userId, req.body);
    sendResponse(res, {
        statusCode: status.CREATED,
        message: 'Course created successfully',
        data: result,
    });
});

const getAllCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getAllCoursesFromDB(req.query);

    sendResponse(res, {
        statusCode: status.OK,
        meta: result.meta,
        message: 'All Courses fetched successfully',
        data: result.result,
    });
});

const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.updateCourseIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        message: 'Course updated successfully',
        data: result,
    });
});

const getCourseByIdWithReviews = catchAsync(async (req, res) => {
    const { id } = req.params;
    const course = await CourseServices.getCourseByIdFromDB(id);
    if (!course) {
        throw new AppError(
            status.NOT_FOUND,
            'Course not found',
            `${id} is not fund in course`,
        );
    }
    const reviews = await ReviewServices.getReviewByCourseIdFromDB(id);
    const result = {
        course,
        reviews,
    };
    sendResponse(res, {
        statusCode: status.OK,
        message: 'Course with reviews fetched successfully',
        data: result,
    });
});

const getBestCourse = catchAsync(async (req, res) => {
    const result = await ReviewServices.getBestCourseFromDB();
    sendResponse(res, {
        statusCode: status.OK,
        message: 'Best course retrieved successfully',
        data: result,
    });
});

export const CourseControllers = {
    createCourse,
    getAllCourses,
    updateCourse,
    getCourseByIdWithReviews,
    getBestCourse,
};
