/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errors/AppError';
import { checkPassword, hashPassword } from '../../utils/password';
import { TPreviousPassword, TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { generateToken } from '../../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { formatDate } from './auth.utils';
import mongoose from 'mongoose';

const registerUserIntoDB = async (payload: TUser) => {
    payload.password = await hashPassword(payload.password as string);
    const result = await User.create(payload);
    return result;
};

const userLogin = async (payload: { username: string; password: string }) => {
    const user = await User.findOne({ username: payload.username }).select(
        '_id password username email role',
    );

    if (!user) {
        throw new AppError(
            status.NOT_FOUND,
            'User not found',
            `${payload.username} is not registered`,
        );
    }

    const passwordMatch = await checkPassword(
        payload.password,
        user.password as string,
    );

    if (!passwordMatch) {
        throw new AppError(
            status.FORBIDDEN,
            'Forbidden access',
            'Password did not matched',
        );
    }

    user.password = undefined;

    //send access token
    const jwtPayload = {
        _id: user._id,
        role: user.role,
        email: user.email,
    };
    const token = generateToken(jwtPayload);

    return { user, token };
};

const changePassword = async (
    jwtPayload: JwtPayload,
    payload: { currentPassword: string; newPassword: string },
) => {
    const user = await User.findById(jwtPayload._id).select(
        'password previousPasswords passwordChangedAt createdAt',
    );

    if (!user) {
        throw new AppError(
            status.NOT_FOUND,
            'User not found',
            'User not found',
        );
    }

    if (
        !(await checkPassword(payload.currentPassword, user.password as string))
    ) {
        throw new AppError(
            status.FORBIDDEN,
            'Forbidden access',
            'Password did not matched',
        );
    }

    if (await checkPassword(payload.newPassword, user.password as string)) {
        throw new AppError(
            status.BAD_REQUEST,
            'Bad Request',
            'New password can not be your current password',
        );
    }

    if (user.previousPasswords?.length) {
        for (const el of user.previousPasswords) {
            if (await checkPassword(payload.newPassword, el.password)) {
                throw new AppError(
                    status.BAD_REQUEST,
                    'Bad Request',
                    `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${formatDate(el.timestamp)}).`,
                );
            }
        }
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        if ((user.previousPasswords as TPreviousPassword[]).length >= 2) {
            const oldest = (
                user.previousPasswords as TPreviousPassword[]
            ).reduce((prev, curr) =>
                prev.timestamp.getTime() < curr.timestamp.getTime()
                    ? prev
                    : curr,
            );

            const removeOldPassword = await User.findByIdAndUpdate(
                user._id,
                {
                    $pull: {
                        previousPasswords: { timestamp: oldest.timestamp },
                    },
                },
                {
                    new: true,
                    session,
                },
            );

            if (!removeOldPassword) {
                throw new AppError(
                    status.BAD_REQUEST,
                    'Bad Request',
                    'Failed to change password',
                );
            }
        }

        const newHashedPassword = await hashPassword(payload.newPassword);

        const result = await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    password: newHashedPassword,
                    passwordChangedAt: new Date(),
                },
                $push: {
                    previousPasswords: {
                        password: user.password,
                        timestamp: user.passwordChangedAt || user.createdAt,
                    },
                },
            },
            {
                new: true,
                session,
            },
        );

        if (!result) {
            throw new AppError(
                status.BAD_REQUEST,
                'Bad Request',
                'Failed to change password',
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return result;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(err.statusCode, err.message, err.errorMessage);
    }
};

export const AuthServices = {
    registerUserIntoDB,
    userLogin,
    changePassword,
};
