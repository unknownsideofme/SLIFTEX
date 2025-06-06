import React, { useEffect } from 'react';
import { User, Lock, Shield } from 'lucide-react';
import { useState } from 'react';
import {useDispatch , useSelector} from 'react-redux'
import { updateSignInAction  , resetSignInAction} from '../features/SignIn';
import {useNavigate} from 'react-router-dom'
import siginUserCall from '../api_utils/Signin'; 
import axios from 'axios';

const SignInForm = () => {
  const navigate = useNavigate() ;

 // automatic navigate to page if the user is signed in 
  useEffect(()=>{
    const token = localStorage.getItem('sliftex_jwt_token') ; 
    if(token){
      try{
        const verify = async () => {
          const res = await axios.post('http://localhost:5000/api/jwt-auth' , {token}) ;
          console.log(res.data) ;
          if(res.data.success) {
            navigate('/service' , {replace:true}) ; 
          } else {
            console.error("JWT authentication failed") ; 
          }
        }
        verify() ;

      }catch(err){
        console.error(`Error during JWT verification: ${err.message}`) ; 
      } ;
    }
    
  }, [navigate]) ;


  
  const dispatch = useDispatch() ; 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe , setRememberMe] = useState(false);
  const [accessLevel , setAccessLevel] = useState('user')
  const print = () => {
    console.log(`Email: ${email}, Password: ${password}, Remember Me: ${rememberMe}, Access Level: ${accessLevel}`);
  }

  //submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    dispatch(updateSignInAction({ email, password, accessLvl: accessLevel, rememberMe }));
  
    try {
      //api call for signin verification
      const res = await siginUserCall({ email, password, rememberMe });
      console.log("Sign-in response:", res);
      
      if(res && res.success) {
        //handling success and jwt 
        const token = res.token ; 
        const user = res.user ; 
        console.log(`token: ${token} , user data: ${user.id}`);
        localStorage.setItem( 'sliftex_jwt_token', token) ;
        localStorage.setItem('sliftex_user_data', user) ; 

        navigate("/service" , {replace : true}) ; 
        

      }
    } catch (err) {
      //bhang bhosra error
      console.error("Sign-in failed:", err);
      alert("Sign in Failed") ;
    }


  };
  
  return (

    <div>
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="email"
              value={email} 
              onChange={(e) => {
                print() ; 
                return setEmail(e.target.value)}}

              className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Access Level Selection */}
        <div>
          <label htmlFor="accessLevel" className="block mb-2 text-sm font-medium text-gray-700">
            Access Level
          </label>
          <div className="relative">
            <User className="absolute w-5 h-5 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
              className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg appearance-none bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superuser">Super User</option>
            </select>
            <div className="absolute transform -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              value={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-300"
            />
            <label htmlFor="remember" className="block ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm text-gray-600 transition-colors hover:text-gray-800">
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          
          className="w-full bg-gray-100 bg-opacity-80 backdrop-blur-sm text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-200 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] border border-gray-200"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignInForm;