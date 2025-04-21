import React, { useState } from 'react';
import Modal from './Modal';

export default function UploadModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    file: null,
    title: '',
    description: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // Helper function to get cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Get token from cookie
      const authToken = getCookie('authToken');
      
      if (!authToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Create FormData for multipart/form-data submission
      const apiFormData = new FormData();
      apiFormData.append('file', formData.file);
      apiFormData.append('title', formData.title);
      apiFormData.append('description', formData.description);
      apiFormData.append('password', formData.password);
      
      // Make API request with Bearer token in Authorization header
      const response = await fetch('https://api.ambientlightfilm.net/api/videos', {
        method: 'POST',
        body: apiFormData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
          // No Content-Type header as it's set automatically with FormData
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload video');
      }
      
      setUploadResult(result);
      console.log('Upload successful:', result);
      
      // Close modal after 3 seconds on success
      setTimeout(() => {
        onClose();
        setUploadResult(null);
      }, 3000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Upload Video</h2>
        
        {uploadResult ? (
          <div className="bg-green-800 bg-opacity-25 border border-green-700 rounded-md p-4 mb-4">
            <h3 className="text-green-400 font-semibold mb-2">Upload Successful!</h3>
            <p className="text-green-200">Your video "{uploadResult.data.video.title}" has been uploaded.</p>
          </div>
        ) : error ? (
          <div className="bg-red-800 bg-opacity-25 border border-red-700 rounded-md p-4 mb-4">
            <h3 className="text-red-400 font-semibold mb-2">Upload Failed</h3>
            <p className="text-red-200">{error}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Video File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Video File
              </label>
              <input
                type="file"
                name="file"
                accept="video/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gray-800 file:text-blue-400
                  hover:file:bg-gray-700
                  bg-gray-800 border border-gray-700 rounded-md"
                required
              />
            </div>

            {/* Video Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Video Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 border border-gray-700"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}