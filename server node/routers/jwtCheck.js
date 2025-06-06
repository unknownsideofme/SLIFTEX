import { Router } from 'express';
import jwtController from '../controllers/jwtController.js';

const jwtRouter = Router();

jwtRouter.post('/', jwtController);

export default jwtRouter ; 
