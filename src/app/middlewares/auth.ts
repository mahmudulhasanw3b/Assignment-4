import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import status from 'http-status';
import { verifyToken } from '../utils/jwt';
import { User } from '../modules/user/user.model';
import { TUserRoles } from '../modules/user/user.interface';

const auth = (...requiredRoles: TUserRoles[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers.authorization;
            if (!token) {
                throw new AppError(
                    status.UNAUTHORIZED,
                    'Unauthorized Access',
                    'You do not have the necessary permissions to access this resource.',
                );
            }

            const decoded = verifyToken(token);

            const { _id, role } = decoded;

            const user = await User.findById(_id);

            if (!user) {
                throw new AppError(
                    status.UNAUTHORIZED,
                    'Unauthorized Access',
                    'You do not have the necessary permissions to access this resource.',
                );
            }

            if (requiredRoles.length && !requiredRoles.includes(role)) {
                throw new AppError(
                    status.FORBIDDEN,
                    'Forbidden access',
                    'You do not have the necessary permissions to access this resource.',
                );
            }

            req.user = decoded;
            next();
        },
    );
};

export default auth;
