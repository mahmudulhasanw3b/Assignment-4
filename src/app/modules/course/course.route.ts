import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', CourseControllers.getAllCourses);
router.get('/:id/reviews', CourseControllers.getCourseByIdWithReviews);
router.get('/best', CourseControllers.getBestCourse);

router.post(
    '/',
    auth('admin'),
    validateRequest(CourseValidations.createCourseValidationsSchema),
    CourseControllers.createCourse,
);

router.put(
    '/:id',
    auth('admin'),
    validateRequest(CourseValidations.updateCourseValidationsSchema),
    CourseControllers.updateCourse,
);

export const CourseRoutes = router;
