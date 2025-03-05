import { model, Schema } from 'mongoose';
import { TCourse, TDetails, TTag } from './course.interface';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { Category } from '../category/category.model';

const tagSchema = new Schema<TTag>(
    {
        name: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        _id: false,
    },
);

const detailsSchema = new Schema<TDetails>(
    {
        level: { type: String, required: true },
        description: { type: String, required: true },
    },
    {
        _id: false,
    },
);

const courseSchema = new Schema<TCourse>(
    {
        title: { type: String, required: true, unique: true },
        instructor: { type: String, required: true },
        categoryId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Category',
        },
        price: { type: Number, required: true },
        tags: { type: [tagSchema], required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        language: { type: String, required: true },
        provider: { type: String, required: true },
        durationInWeeks: { type: Number, required: true },
        details: { type: detailsSchema, required: true },
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

courseSchema.pre('save', async function (next) {
    const isCategoryExists = await Category.findById(this.categoryId);
    if (!isCategoryExists) {
        throw new AppError(
            status.NOT_FOUND,
            'categoryId not Found',
            `${this.categoryId} does not exists in category`,
        );
    }
    next();
});

courseSchema.pre('findOneAndUpdate', async function (next) {
    const id = this.getFilter()._id;
    const isExists = await Course.findById(id);
    const update = this.getUpdate() as Partial<TCourse>;
    const categoryId = update?.categoryId;

    if (categoryId) {
        const isCategoryExists = await Category.findById(categoryId);
        if (!isCategoryExists) {
            throw new AppError(
                status.NOT_FOUND,
                'categoryId not Found',
                `${categoryId} does not exists is category`,
            );
        }
    }

    if (!isExists) {
        throw new AppError(
            status.NOT_FOUND,
            'ID not Found',
            `${id} does not exists in course`,
        );
    }
    next();
});

export const Course = model<TCourse>('Course', courseSchema);
