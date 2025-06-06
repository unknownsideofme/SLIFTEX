import axios from 'axios';

const siginUserCall = async (obj) => {
    console.log("fn called");
  try {
    
    const {email, password , rememberMe} = obj;

    const response = await axios.post('http://localhost:5000/api/signin', {
    email,
    password,
    rememberMe
    });
    console.log(response.data); 
    return response.data ; 


    console.log(response.data); // { message: 'User signed in successfully' }
  } catch (error) {
    console.error('Sign In failed:', error.response?.data || error.message);
  }
};

export default siginUserCall; 
