'use client'

import { useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';

export function VideoContainer({ video: initialVideo, getVideoAction }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State to hold the *complete* video data once fetched
  const [completeVideoData, setCompleteVideoData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setCompleteVideoData(null); // Clear previous data attempt

    // Call the Server Action passed as a prop
    // It needs the video ID (available in initialVideo) and the password
    const result = await getVideoAction(initialVideo.id, password);

    if (result.error) {
      setError(result.error);
      setIsAuthenticated(false); // Ensure not authenticated
    } else if (result.data) {
      // Success! Store the complete data and authenticate
      setCompleteVideoData(result.data);
      console.log(result.data)
      setIsAuthenticated(true);
      // Optional: clear password field after success
      // setPassword('');
    } else {
      // Should not happen with the defined action, but handle defensively
      setError('An unexpected response was received.');
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  };

  // If authenticated, use the completeVideoData for rendering
  if (isAuthenticated && completeVideoData) {
    return (
      <>
        {/* Video Player Section - Pass the complete data */}
        <VideoPlayer video={completeVideoData} />

        {/* Video Description (Mobile) - Use complete data */}
        <div className="md:hidden bg-gray-900/20 rounded-b-lg shadow-md">
          <div className="px-4 pt-4 pb-2">
            <h1 className="text-xl font-bold mb-2 leading-tight">{completeVideoData.title}</h1>
            <div className="flex items-center justify-between text-gray-300 mb-1">
              {/* Use placeholder/actual data as available in completeVideoData */}
              <span className="font-medium">{completeVideoData.creator || 'N/A'}</span>
            </div>
          </div>
          <div className="px-4 py-3 border-t border-gray-800">
            <p className="text-sm leading-relaxed text-gray-200">
              {completeVideoData.description}
            </p>
          </div>
        </div>

        {/* Video Description (Desktop) - Use complete data */}
        <div className="mt-3 md:mt-5">
          <div className="p-3 p-md-6 sm:p-4 bg-gray-800/50 rounded-lg hidden md:block">
            <div className="text-sm sm:text-base text-gray-200">
              <p>{completeVideoData.description}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If not authenticated, show the password form (UI remains the same)
  return (
    <div className="p-8 m-4 mt-4 rounded-lg shadow-2xl max-w-md my-auto md:mx-auto border border-gray-800/90 relative overflow-hidden">
      <div className="absolute inset-0 opacity-80 z-0"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-white tracking-tight">Protected Content</h2>
        <p className="mb-8 text-gray-400 text-center text-sm">
          {/* Use initial title if needed, or keep generic */}
          Enter your password to access the video: {initialVideo.title || ''}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Password Input (no changes needed here) */}
           <div className="mb-6">
            <label htmlFor="password" className="block text-xs font-medium mb-2 text-gray-300 uppercase tracking-wide">
              Enter video password
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

          {/* Error Display (no changes needed here) */}
          {error && (
            <div className="mb-4 text-red-400 text-sm font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}

          {/* Submit Button (no changes needed here) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-md font-medium transition-all duration-300 disabled:opacity-70 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Verifying...
              </span>
            ) : 'Access Video'}
          </button>
        </form>

        {/* Footer Text (no changes needed here) */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Need assistance? Contact your administrator
        </div>
      </div>
    </div>
  );
}