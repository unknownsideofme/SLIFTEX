import jwt from 'jsonwebtoken';

import { jwt_secret } from '../constants.js';

const jwtController = async (req,res)=>{
    const {token} = req.body  ; 
    if(!token){
        return res.status(401).json({message: 'Token is required'});
    }
    jwt.verify(token, jwt_secret, (err, decoded) => {
        if (err) {
          // Token invalid or expired
          return res.status(403).json({ message: 'Invalid or expired token' });
        }else{
            return res.status(200).json({ message: 'Token is valid', data: decoded, success: true});
        }
    })
}
export default jwtController ; 