
import { mongo_uri } from '../constants.js';
import mongoose from 'mongoose';


export const connectDB = async () => {
    try{
        mongoose.connect(mongo_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('✅ MongoDB connected'))
        .catch((err) => console.error('❌ Connection error:', err));
    }catch(err) {
        console.error('❌ MongoDB connection failed',err);
    }
}
