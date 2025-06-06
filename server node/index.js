import express from 'express';
import { connectDB } from './config/mongooseconnect.js';
import registerRouter from './routers/Register.js';
import signinRouter from './routers/Signin.js';
import cors from 'cors';
import { port } from './constants.js';
import jwtRouter from './routers/jwtCheck.js';
connectDB();
const app = express();
app.use(cors());

app.use(express.json()); // to parse JSON body

// Routing middleware
app.use("/api/register", registerRouter);
app.use("/api/signin", signinRouter);  
app.use("/api/jwt-auth", jwtRouter )

app.listen(port, () => console.log(`Server running on port ${port}`));



