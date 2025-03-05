import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidations } from './review.validation';
import { ReviewControllers } from './review.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/',
    auth('user'),
    validateRequest(ReviewValidations.createReviewValidationSchema),
    ReviewControllers.createReview,
);

export const ReviewRoutes = router;
