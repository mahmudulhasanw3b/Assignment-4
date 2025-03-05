import { Types } from 'mongoose';
import { TCategory } from './category.interface';
import { Category } from './category.model';
import AppError from '../../errors/AppError';
import status from 'http-status';

const createCategoryIntoDB = async (userId: string, payload: TCategory) => {
    const isCategoryExists = await Category.findOne({ name: payload.name });
    if (isCategoryExists) {
        throw new AppError(
            status.CONFLICT,
            'Conflict in database',
            'This category is already exists',
        );
    }

    payload.createdBy = new Types.ObjectId(userId);
    const result = await Category.create(payload);
    return result;
};

const getAllCategoriesFromDB = async () => {
    const result = await Category.find().populate('createdBy');
    return result;
};

export const CategoryServices = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
};
