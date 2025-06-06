import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: false,
    } , 

    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    password: {
        type: String,
        required: true,
    },previlages: {
        type: String,
        enum: ['admin', 'user' , 'superuser'],
        default: 'user',
    }

}) ; 

export default mongoose.model('User', userSchema);