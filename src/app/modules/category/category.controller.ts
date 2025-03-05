import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.service';

const createCategory = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const result = await CategoryServices.createCategoryIntoDB(
        userId,
        req.body,
    );
    sendResponse(res, {
        statusCode: status.CREATED,
        message: 'Category created successfully',
        data: result,
    });
});

const getAllCategories = catchAsync(async (req, res) => {
    const result = await CategoryServices.getAllCategoriesFromDB();
    sendResponse(res, {
        statusCode: status.OK,
        message: 'All Categories fetched successfully',
        data: result,
    });
});

export const CategoryControllers = {
    createCategory,
    getAllCategories,
};
