import express from 'express';
import { CategoryRoutes } from '../modules/category/category.route';
import { UserRoutes } from '../modules/userAuth/user.route';
import { EventRoutes } from '../modules/event/event.route';

const router=express.Router();

const routeModules=[
    {
        path:'/',
        route:CategoryRoutes
    },
    {
        path:'/',
        route:UserRoutes
    },
    {
        path:'/',
        route:EventRoutes
    },
]

routeModules.forEach(route=>router.use(route.path,route.route));
export default router;