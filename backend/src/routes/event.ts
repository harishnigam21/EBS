import { Router } from 'express';
import * as EventController from '../controllers/event';
import { CreateEventSchema } from '../validations/schemas';
import { validate } from '../middlewars/validate';

const router = Router();

router.get('/', EventController.getAllEvents); 
router.post('/', validate(CreateEventSchema), EventController.createEvent); 

export default router;