import axios from 'axios';
import { URL_REGISTER } from '../constant.js';
export const registerUserCall = async (obj) => {
    console.log("fn called");
  try {
    
    const { firstName, lastName, email, password, previlages } = obj;

    const response = await axios.post(URL_REGISTER, {
    firstName: firstName,
    lastName: lastName,
    email,
    password,
    previlages, 
    });


    console.log(response.data); // { message: 'User registered successfully' }

    if(response.status === 200){
      return {
        response: response.data,
        status: response.status
      }
    }
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
};

