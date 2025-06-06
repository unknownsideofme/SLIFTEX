import { registerController } from '../controllers/RegisterController.js';
import { Router } from 'express';

const registerRouter = Router();

registerRouter.post('/', registerController);

export default registerRouter ; 
