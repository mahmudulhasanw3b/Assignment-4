import status from 'http-status';
import config from '../config';
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';
import { THandleErrorResponse } from '../interface/error';
import handleValidationError from '../errors/handleValidationError';
import handleDuplicateError, {
    duplicateErrorRegex,
} from '../errors/handleDuplicateError';
import handleCastError from '../errors/handleCastError';
import AppError from '../errors/AppError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode: number = err?.statusCode || status.INTERNAL_SERVER_ERROR;
    let message: string = 'Something went wrong';
    let errorMessage: string = err?.message || 'Something went wrong';
    let errorDetails = err;

    let match: RegExpMatchArray | undefined;
    let newMessage: THandleErrorResponse | undefined;

    if (err instanceof ZodError) {
        newMessage = handleZodError(err);
    } else if (err?.name === 'ValidationError') {
        newMessage = handleValidationError(err);
    } else if (err?.name === 'CastError') {
        newMessage = handleCastError(err);
    } else if ((match = err?.message.match(duplicateErrorRegex))) {
        newMessage = handleDuplicateError(match);
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorMessage = err.errorMessage;
        errorDetails = null;
    }

    if (newMessage) {
        statusCode = newMessage.statusCode;
        message = newMessage.message;
        errorMessage = newMessage.errorMessage.trim();
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errorMessage,
        errorDetails,
        stack: config.NODE_ENV === 'development' ? err?.stack : undefined,
    });
};

export default globalErrorHandler;
