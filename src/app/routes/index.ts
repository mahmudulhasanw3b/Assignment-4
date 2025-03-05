import { Router } from 'express';
import { CourseRoutes } from '../modules/course/course.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { authRoutes } from '../modules/auth/auth.route';

const router = Router();

const moduleRoutes = [
    {
        path: '/course',
        route: CourseRoutes,
    },
    {
        path: '/categories',
        route: CategoryRoutes,
    },
    {
        path: '/reviews',
        route: ReviewRoutes,
    },
    {
        path: '/auth',
        route: authRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
