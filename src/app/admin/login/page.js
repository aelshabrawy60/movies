"use client";

import React, { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);

  // Function to set cookie with expiration
  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure`;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.ambientlightfilm.net/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.status === 'success' && data.message === "OTP sent to your email") {
        // Show OTP input form
        setShowOtpForm(true);
        setIsLoading(false);
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error connecting to the server. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.ambientlightfilm.net/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Store token in cookies (30 days expiration)
        console.log("data", data);
        setCookie('authToken', data.data.token, 30);
        
        // Also store user data in cookies
        setCookie('userData', JSON.stringify(data.data.user), 30);
                
        // Redirect to dashboard
        window.location.href = '/dashboard/videos';
      } else {
        setError(data.message || 'OTP verification failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Error connecting to the server. Please try again later.');
      setIsLoading(false);
    }
  };

  // Resend OTP function
  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.ambientlightfilm.net/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.status === 'success' && data.message === "OTP sent to your email") {
        setError('');
        setIsLoading(false);
      } else {
        setError(data.message || 'Failed to resend OTP. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Error connecting to the server. Please try again later.');
      setIsLoading(false);
    }
  };

  // Render login form or OTP form based on the state
  return (
    <div className="min-h-screen p-4 w-full flex items-center justify-center bg-gray-950 py-12">
      <div className="p-8 rounded-lg shadow-2xl max-w-md w-full border border-gray-800/90 relative overflow-hidden bg-gray-950">
        {/* Subtle professional gradient overlay */}
        <div className="absolute inset-0 opacity-80 z-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
        
        {/* Content with relative positioning to appear above the gradient */}
        <div className="relative z-10">
          {!showOtpForm ? (
            // Login Form
            <>
              <h2 className="text-2xl font-bold mb-6 text-center text-white tracking-tight">Login</h2>
              <p className="mb-8 text-gray-400 text-center text-sm">
                Enter your credentials to access your account.
              </p>
              
              <form onSubmit={handleLoginSubmit}>
                {/* Email Field */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-xs font-medium mb-2 text-gray-300 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 bg-gray-900 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-200 shadow-inner"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="mb-6">
                  <label htmlFor="password" className="block text-xs font-medium mb-2 text-gray-300 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-gray-900 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-200 shadow-inner"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="mb-4 text-red-400 text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                    {error}
                  </div>
                )}
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-md font-medium transition-all duration-300 disabled:opacity-70 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : 'Log In'}
                </button>
              </form>
            </>
          ) : (
            // OTP Verification Form
            <>
              <h2 className="text-2xl font-bold mb-6 text-center text-white tracking-tight">OTP Verification</h2>
              <p className="mb-8 text-gray-400 text-center text-sm">
                Please enter the OTP sent to your email address.
              </p>
              
              <form onSubmit={handleOtpSubmit}>
                {/* OTP Field */}
                <div className="mb-6">
                  <label htmlFor="otp" className="block text-xs font-medium mb-2 text-gray-300 uppercase tracking-wide">
                    One-Time Password
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full p-3 bg-gray-900 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-200 shadow-inner"
                      placeholder="Enter your OTP"
                      required
                    />
                  </div>
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="mb-4 text-red-400 text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                    {error}
                  </div>
                )}
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-md font-medium transition-all duration-300 disabled:opacity-70 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : 'Verify OTP'}
                </button>
                
                {/* Resend OTP Option */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
                  >
                    Didn't receive an OTP? Resend
                  </button>
                </div>
                
                {/* Back to Login Button */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setShowOtpForm(false)}
                    className="text-gray-400 hover:text-gray-300 text-sm transition-colors duration-200"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;