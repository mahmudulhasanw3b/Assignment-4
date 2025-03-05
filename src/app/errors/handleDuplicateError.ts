import status from 'http-status';
import { THandleErrorResponse } from '../interface/error';

export const duplicateErrorRegex =
    /E11000 duplicate key error collection: .* index: (\w+)_\d+ dup key: { \1: "([^"]+)" }/;

const handleDuplicateError = (
    match: RegExpMatchArray,
): THandleErrorResponse => {
    const errorMessage = `${match[2]} is already exits in ${match[1]}`;

    return {
        statusCode: status.CONFLICT,
        message: 'Duplicate Error',
        errorMessage,
    };
};

export default handleDuplicateError;
