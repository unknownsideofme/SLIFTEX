import React, { useState } from 'react';
import SignInForm from '../components_service/SignInForm';
import RegistrationForm from '../components_service/RegistrationForm';

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-white">
      <div className="w-full max-w-md">
        <div className="overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-2xl">
          {/* Header with toggle buttons */}
          <div className="p-6 bg-gray-50 bg-opacity-80">
            <div className="flex p-1 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm">
              <button
                onClick={() => setIsSignIn(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  isSignIn
                    ? 'bg-black text-white shadow-md border border-gray-200'
                    : 'bg-white text-black hover:bg-white/20'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignIn(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  !isSignIn
                    ? 'bg-black text-white shadow-md border border-gray-200'
                    : 'text-black bg-white hover:bg-white/20'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Form content */}
          <div className="p-8">
            {isSignIn ? <SignInForm /> : <RegistrationForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;