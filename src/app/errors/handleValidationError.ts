import status from 'http-status';
import mongoose from 'mongoose';
import { THandleErrorResponse } from '../interface/error';

const handleValidationError = (
    err: mongoose.Error.ValidationError,
): THandleErrorResponse => {
    let errorMessage = '';

    Object.values(err.errors).forEach(
        (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            errorMessage += `${value?.path} is ${value?.kind.toLowerCase()}. `;
        },
    );

    return {
        statusCode: status.BAD_REQUEST,
        message: 'Validation Error',
        errorMessage,
    };
};

export default handleValidationError;
