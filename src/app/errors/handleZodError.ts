import { ZodError, ZodIssue } from 'zod';
import { THandleErrorResponse } from '../interface/error';
import status from 'http-status';

const handleZodError = (err: ZodError): THandleErrorResponse => {
    let errorMessage = '';

    err.issues.forEach((issue: ZodIssue) => {
        errorMessage += `${issue.path[issue.path.length - 1]} is ${issue.message.toLowerCase()}. `;
    });

    return {
        statusCode: status.BAD_REQUEST,
        message: 'Validation Error',
        errorMessage,
    };
};

export default handleZodError;
