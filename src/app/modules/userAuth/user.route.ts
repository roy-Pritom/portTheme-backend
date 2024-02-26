import express from 'express';
import validationCheck from '../../middleware/validationCheck';
import { UserValidationSchemas } from './user.validation';
import { UserControllers } from './user.controller';
import auth from '../../middleware/auth';
import { userRole } from './user.constant';

const router=express.Router();

router.post('/api/auth/register',validationCheck(UserValidationSchemas.userValidationSchema),UserControllers.userRegister)
// login
router.post('/api/auth/login',validationCheck(UserValidationSchemas.userLoginValidationSchema),UserControllers.userLogin)

// password change
router.post('/api/auth/change-password',auth(userRole.admin,userRole.user),validationCheck(UserValidationSchemas.passwordChangedValidationSchema),UserControllers.changePassword)


export const UserRoutes=router;