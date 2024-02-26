import express from 'express';
import { EventControllers } from './event.controller';


const router=express.Router();
// create category
router.post('/api/create-event',EventControllers.createEvent)


export const EventRoutes=router;