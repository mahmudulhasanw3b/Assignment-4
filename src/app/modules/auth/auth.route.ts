import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from '../user/user.validation';
import { AuthControllers } from './auth.controller';
import { AuthValidations } from './auth.validation';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
    '/register',
    validateRequest(UserValidations.createUserValidationSchema),
    AuthControllers.registerUser,
);

router.post(
    '/login',
    validateRequest(AuthValidations.loginValidationSchema),
    AuthControllers.userLogin,
);

router.post(
    '/change-password',
    auth(),
    validateRequest(AuthValidations.changePasswordValidationSchema),
    AuthControllers.changePassword,
);

export const authRoutes = router;
