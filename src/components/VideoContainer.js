// VideoContainer.jsx (Client Component)
'use client'

import { useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';

export function VideoContainer({ video, verifyPassword }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const isValid = await verifyPassword(password);
    
    if (isValid) {
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password');
    }
    
    setIsLoading(false);
  };

  if (isAuthenticated) {
    return (
      <>
        {/* Video Player Section */}
        <VideoPlayer video={video} />
        
        {/* Video Description (Mobile) */}
        <div className="md:hidden bg-gray-900/20 rounded-b-lg shadow-md">
          <div className="px-4 pt-4 pb-2">
            <h1 className="text-xl font-bold mb-2 leading-tight">{video.title}</h1>
            <div className="flex items-center justify-between text-gray-300 mb-1">
              <span className="font-medium">{video.creator}</span>
              <span className="text-sm bg-gray-800/80 px-2 py-1 rounded-full">{video.duration}</span>
            </div>
          </div>
          <div className="px-4 py-3 border-t border-gray-800">
            <p className="text-sm leading-relaxed text-gray-200">
              {video.description}
            </p>
          </div>
        </div>
        
        {/* Video Description (Desktop) */}
        <div className="mt-3 md:mt-5 p-3 p-md-6 sm:p-4 bg-gray-800/50 rounded-lg hidden md:block">
          <div className="text-sm sm:text-base text-gray-200">
            <p>{video.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className=" p-8 m-4 mt-4 rounded-lg shadow-2xl max-w-md my-auto md:mx-auto border border-gray-800/90 relative overflow-hidden">
      {/* Subtle professional gradient overlay */}
      <div className="absolute inset-0 opacity-80 z-0"></div>
      
      {/* Content with relative positioning to appear above the gradient */}
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-white tracking-tight">Protected Content</h2>
        <p className="mb-8 text-gray-400 text-center text-sm">
          Enter your password to access this exclusive video.
        </p>
        
        <form onSubmit={handleSubmit}>
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
                required
              />
            </div>
          </div>
          
          {error && (
            <div className="mb-4 text-red-400 text-sm font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
              </svg>
              {error}
            </div>
          )}
          
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
            ) : 'Access Video'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          Need assistance? Contact your administrator
        </div>
      </div>
    </div>
  );
}