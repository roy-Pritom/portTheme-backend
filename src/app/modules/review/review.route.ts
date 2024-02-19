import express from 'express';
import validationCheck from '../../middleware/validationCheck';
import { reviewValidationSchemas } from './review.validation';
import { ReviewControllers } from './review.controller';
import auth from '../../middleware/auth';
import { userRole } from '../userAuth/user.constant';


const router=express.Router();
// Create a Review (Only the user can do this)
router.post('/api/reviews',auth(userRole.user),validationCheck(reviewValidationSchemas.createReviewValidationSchema),ReviewControllers.createReview);

export const ReviewRoutes=router;