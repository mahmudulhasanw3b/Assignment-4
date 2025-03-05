import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryControllers } from './category.controller';
import { CategoryValidations } from './category.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', CategoryControllers.getAllCategories);

router.post(
    '/',
    auth('admin'),
    validateRequest(CategoryValidations.categoryValidationSchema),
    CategoryControllers.createCategory,
);

export const CategoryRoutes = router;
