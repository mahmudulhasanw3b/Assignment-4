import { startSession, Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TCourse, TTag } from './course.interface';
import { Course } from './course.model';
import { generateWeeks } from './course.utils';
import AppError from '../../errors/AppError';
import status from 'http-status';

const createCourseIntoDB = async (userId: string, payload: TCourse) => {
    payload.durationInWeeks = generateWeeks(
        payload.startDate as string,
        payload.endDate as string,
    );
    payload.createdBy = new Types.ObjectId(userId);
    const result = await Course.create(payload);
    return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(
        Course.find().populate('createdBy'),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .price()
        .date();
    const result = await courseQuery.modelQuery;
    const meta = await courseQuery.totalCount();

    return { meta, result };
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { tags, details, ...primitiveData } = payload;

    const modifiedData: Record<string, unknown> = primitiveData;

    if (details && Object.keys(details)) {
        Object.entries(details).forEach(([key, value]) => {
            modifiedData[`details.${key}`] = value;
        });
    }

    const session = await startSession();

    try {
        session.startTransaction();
        const result = await Course.findByIdAndUpdate(id, modifiedData, {
            new: true,
        });

        if (!result) {
            throw new AppError(
                status.BAD_REQUEST,
                'Internal Server Error',
                'Failed to update Course',
            );
        }

        if (tags && tags.length) {
            const removeTags: string[] = tags
                .filter((el) => el.name && el.isDeleted)
                .map((el) => el.name);

            const afterRemove = await Course.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        tags: {
                            name: { $in: removeTags },
                        },
                    },
                },
                { new: true },
            );

            if (!afterRemove) {
                throw new AppError(
                    status.BAD_REQUEST,
                    'Internal Server Error',
                    'Failed to update Course',
                );
            }

            const addTags: TTag[] = tags.filter(
                (el) => el.name && !el.isDeleted,
            );

            const afterAdd = await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: {
                        tags: {
                            $each: addTags,
                        },
                    },
                },
                { new: true },
            );

            if (!afterAdd) {
                throw new AppError(
                    status.BAD_REQUEST,
                    'Internal Server Error',
                    'Failed to update Course',
                );
            }

            await session.commitTransaction();
            await session.endSession();

            return afterAdd;
        }

        await session.commitTransaction();
        await session.endSession();

        return result;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        session.abortTransaction();
        session.endSession();
        throw new AppError(error.statusCode, error.message, error.errorMessage);
    }
};

const getCourseByIdFromDB = async (id: string) => {
    const result = await Course.findById(id).populate('createdBy');
    return result;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    updateCourseIntoDB,
    getCourseByIdFromDB,
};
