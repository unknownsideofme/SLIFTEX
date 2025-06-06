import User from "../models/User.models.js";   
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { jwt_secret, jwt_expiration } from "../constants.js";
export async function signinController(req, res){
    try{
        const{email ,password ,rememberMe} = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch === false) {
            return res.status(401).json({ message: "Invalid credentials" });
            
        }
        else {
            const payload = { id: user._id, email: user.email };
            const expiresIn = rememberMe ? jwt_expiration : '2h'; // 7 days if "remember me", else 2 hours

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
            return res.status(200).json({ message: "Signin successful" ,success: true, token: token, user: { id: user._id, email: user.email, accessLevel: user.accessLevel } });
            
        }
    }catch(err){
        console.error("Error in signinController:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}