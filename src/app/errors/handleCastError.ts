import mongoose from 'mongoose';

import status from 'http-status';
import { THandleErrorResponse } from '../interface/error';

const handleCastError = (
    err: mongoose.Error.CastError,
): THandleErrorResponse => {
    const errorMessage = `${err.value} is not a valid ID!`;

    return {
        statusCode: status.BAD_REQUEST,
        message: 'Invalid ID',
        errorMessage,
    };
};

export default handleCastError;
