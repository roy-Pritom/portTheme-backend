import express from 'express';
import { CategoryRoutes } from '../modules/category/category.route';
import { CourseRoutes } from '../modules/course/course.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { UserRoutes } from '../modules/userAuth/user.route';

const router=express.Router();

const routeModules=[
    {
        path:'/',
        route:CategoryRoutes
    },
    {
        path:'/',
        route:CourseRoutes
    },
    {
        path:'/',
        route:ReviewRoutes
    },
    {
        path:'/',
        route:UserRoutes
    },
]

routeModules.forEach(route=>router.use(route.path,route.route));
export default router;