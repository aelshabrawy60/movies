import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Assuming Modal component is in the same directory

export default function EditVideoModal({ isOpen, onClose, video, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    plain_password: '', // Keep this state field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  // Update form data and video URL when video changes
  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || '',
        description: video.description || '',
        // Initialize with existing password, but it must be provided on submit
        plain_password: video.plain_password || '',
      });
      const siteDomain = typeof window !== 'undefined' ? window.location.origin : '';
      if (siteDomain && video.video_id) {
          setVideoUrl(`${siteDomain}/video/${video.video_id}`);
      } else {
          setVideoUrl(''); // Reset if missing parts
      }
    } else {
      setVideoUrl('');
       // Optionally reset form data if no video
       setFormData({ title: '', description: '', plain_password: '' });
    }
  }, [video]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser submission

    // Basic check if password is empty (though 'required' attribute handles this)
    if (!formData.plain_password) {
        setError("Password is required.");
        return; // Stop submission if password is empty (extra safety)
    }

    setLoading(true);
    setError(null);

    try {
      const authToken = getCookie('authToken');
      if (!authToken) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`https://api.ambientlightfilm.net/api/videos/${video.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${authToken}`
        },
        body: new URLSearchParams({
          title: formData.title,
          description: formData.description,
          password: formData.plain_password // Send the password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result?.errors?.detail || result?.message || 'Failed to update video';
        throw new Error(errorMessage);
      }

      onSave(result.data);
      onClose(); // Close modal on success

    } catch (err) {
      setError(err.message || 'An unexpected error occurred.'); // Ensure error is always a string
    } finally {
      setLoading(false);
    }
  };

  const getCookie = (name) => {
     if (typeof document === 'undefined') return null; // Guard against SSR
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCopyLink = () => {
    if (!videoUrl || !navigator.clipboard) return; // Check for clipboard support

    navigator.clipboard.writeText(videoUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy video link: ', err);
        setError('Failed to copy link. Please try again.');
      });
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Video</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal" // Accessibility
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-900 text-white p-3 rounded-md text-sm break-words"> {/* Added break-words */}
            Error: {error}
          </div>
        )}

        {/* Video Link Section */}
        {videoUrl && (
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Shareable Video Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={videoUrl}
                readOnly
                className="flex-grow bg-gray-900 border border-gray-700 text-gray-400 px-3 py-2 rounded-md focus:outline-none text-sm truncate" // Added truncate
                aria-label="Video Share Link"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center justify-center min-w-[80px] ${ // Adjusted min-width
                  isCopied
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                }`}
              >
                {/* Copy Icon / Copied State */}
                {isCopied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                 ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-700">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="titleInput">
              Video Title
            </label>
            <input
              id="titleInput"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required // Title is likely required too
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="descriptionInput">
              Description
            </label>
            <textarea
              id="descriptionInput"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required // Description might be required too
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="passwordInput">
              Password <span className="text-red-500">*</span> {/* Indicate required */}
            </label>
            <div className="relative">
              <input
                id="passwordInput"
                type={showPassword ? "text" : "password"}
                name="plain_password"
                value={formData.plain_password}
                onChange={handleChange}
                placeholder="Enter required password" // Updated placeholder
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                required // <-- Make the password field mandatory
                autoComplete="new-password" // Helps prevent browser autofill issues
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {/* Eye Icons SVG */}
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
              {/* Optional: Add a small helper text if needed */}
              {/* <p className="text-xs text-gray-400 mt-1">Password cannot be empty.</p> */}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 border border-gray-700 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center min-w-[130px] transition-colors disabled:opacity-50" // Added disabled style
              disabled={loading || !formData.plain_password} // Also disable if password is empty (client-side check)
            >
              {/* Loading Spinner / Button Text */}
              {loading ? (
                <>
                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Processing...
                 </>
               ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}