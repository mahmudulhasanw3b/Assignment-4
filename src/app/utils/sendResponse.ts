import { Response } from 'express';

interface TMeta {
    page: number;
    limit: number;
    total: number;
}

type TData<T> = {
    statusCode: number;
    meta?: TMeta;
    message?: string;
    data: T;
};

const sendResponse = <T>(res: Response, data: TData<T>) => {
    res.status(data.statusCode).json({
        success: true,
        meta: data.meta || undefined,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data,
    });
};

export default sendResponse;
