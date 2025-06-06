import { Router } from "express";
import { signinController } from "../controllers/SigninController.js";
const signinRouter = Router();  

signinRouter.post("/", signinController)

export default signinRouter;    

