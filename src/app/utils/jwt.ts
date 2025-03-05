import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import config from '../config';
import ms from 'ms';
import { Types } from 'mongoose';

export const generateToken = (payload: {
    _id: Types.ObjectId;
    role: 'user' | 'admin';
    email: string;
}) => {
    const options: SignOptions = {
        expiresIn: config.jwt_access_expires_in as ms.StringValue,
    };
    return jwt.sign(payload, config.jwt_access_secret as string, options);
};

export const verifyToken = (token: string) =>
    jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
