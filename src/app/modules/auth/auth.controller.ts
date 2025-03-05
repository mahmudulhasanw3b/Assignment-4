import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const registerUser = catchAsync(async (req, res) => {
    const result = await AuthServices.registerUserIntoDB(req.body);
    sendResponse(res, {
        statusCode: status.CREATED,
        message: 'User registered successfully',
        data: result,
    });
});

const userLogin = catchAsync(async (req, res) => {
    const result = await AuthServices.userLogin(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        message: 'User login successful',
        data: result,
    });
});

const changePassword = catchAsync(async (req, res) => {
    const result = await AuthServices.changePassword(req.user, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        message: 'Password changed successfully',
        data: result,
    });
});

export const AuthControllers = {
    registerUser,
    userLogin,
    changePassword,
};
