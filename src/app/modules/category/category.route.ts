import express from 'express';
import validationCheck from '../../middleware/validationCheck';
import { CategoryValidationSchemas } from './category.validation';
import { CategoryControllers } from './category.controller';
import auth from '../../middleware/auth';
import { userRole } from '../userAuth/user.constant';

const router=express.Router();
// create category
router.post('/api/categories',auth(userRole.admin),validationCheck(CategoryValidationSchemas.categoryValidationSchema),CategoryControllers.createCategory)
// get all category
router.get('/api/categories',CategoryControllers.getAllCategory)

export const CategoryRoutes=router;