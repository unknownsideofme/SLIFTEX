import React from 'react';
import { User, Lock, Shield, Mail } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateUserAction } from '../features/User';


const RegistrationForm = () => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState(''); 
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState(''); 
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [accessLevel, setAccessLevel] = React.useState('user');
  const dispatch = useDispatch();
  const print = () => {
    console.log(`First Name: ${firstName}, Last Name: ${lastName}, Email: ${email}, Password: ${password}, Confirm Password: ${confirmPassword}, Access Level: ${accessLevel}`);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch the action to update the state
    if (String(password) !== String(confirmPassword)) {
      alert("Passwords do not match!");
      return;
    }
    dispatch(updateUserAction({ firstName, lastName, email, password, confirmPassword, accessLvl: accessLevel }));
    
    setAccessLevel('user') ; 
    setConfirmPassword('');
    setEmail('') ;
    setFirstName('') ;
    setLastName('') ;

     
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600">Join us today</p>
      </div>

      <form className="space-y-6"
      onSubmit={handleSubmit}>
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700" 
            >
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}  
              className="w-full px-4 py-3 transition-colors border border-gray-200 rounded-lg bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
              placeholder="First name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)} 
              className="w-full px-4 py-3 transition-colors border border-gray-200 rounded-lg bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
              placeholder="Last name"
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
                placeholder="Create password"
              />
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}  

                className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
                placeholder="Confirm password"
              />
            </div>
          </div>
        </div>

        {/* Access Level Selection */}
        <div>
          <label htmlFor="accessLevel" className="block mb-2 text-sm font-medium text-gray-700">
            Requested Access Level
          </label>
          <div className="relative">
            <User className="absolute w-5 h-5 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
            <select
              id="accessLevel"
              name="accessLevel"
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
              className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg appearance-none bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
            >
              <option value="user">User - Basic access</option>
              <option value="admin">Admin - Administrative access</option>
              <option value="superuser">Super User - Full system access</option>
            </select>
            <div className="absolute transform -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Basic access level for standard users
          </p>
        </div>

        

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gray-100 bg-opacity-80 backdrop-blur-sm text-white  py-3 px-4 rounded-lg font-medium hover:bg-gray-200 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] border border-gray-200"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;