import express from 'express';
import validationCheck from '../../middleware/validationCheck';
import { CourseValidationSchemas } from './course.validation';
import { CourseControllers } from './course.controller';
import auth from '../../middleware/auth';
import { userRole } from '../userAuth/user.constant';

const router = express.Router();

// Create a Course (Only Admin can do this)
router.post('/api/courses',auth(userRole.admin),validationCheck(CourseValidationSchemas.createCourseValidationSchema), CourseControllers.createCourse);
// get all course
router.get('/api/courses', CourseControllers.getAllCourse);
// get course single with reviews
router.get('/api/courses/:courseId/reviews', CourseControllers.getSingleCourseWithReviews);
// get best course
router.get('/api/course/best', CourseControllers.getBestCourse);
// Update a Course (Only Admin can do this)
router.put('/api/courses/:courseId',auth(userRole.admin),validationCheck(CourseValidationSchemas.updateCourseValidationSchema), CourseControllers.updateCourse);


export const CourseRoutes = router;