import User from "../models/User.models.js";
import bcrypt from 'bcrypt';

const saltRounds = 10;

export  async function registerController (req, res){
    try{
        const {firstName, lastName, email, password , previlages} = req.body;
        const existing = await User.findOne({ email });
        
        if(!firstName || !email || !password) {

            const missingFields = [];
            if (!firstName) missingFields.push("firstName");
            if (!email) missingFields.push("email");
            if (!password) missingFields.push("password");
            return res.status(400).json({ message: `Please fill all the fields: ${missingFields.join(", ")}` });
        }
    
        if(existing) return res.status(400).json({ message: "User already exists" });
        else {
            const hashedpassword = await bcrypt.hash(password, saltRounds);
            const user = new User({
                firstName,
                lastName,
                email,
                password : hashedpassword,
                previlages
            }) ; 
            await user.save();
            res.status(201).json({ message: "User registered successfully" });


        }

    }catch(err){
        console.error("Error in registerController:", err);
        throw err; 
    }
}