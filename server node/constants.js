import dotenv from 'dotenv';
dotenv.config();
export const mongo_uri = process.env.MONGO_URI

export const port = process.env.PORT || 5000;
export const jwt_secret = process.env.JWT_SECRET
export const jwt_expiration = process.env.JWT_EXPIRATION || '30d';