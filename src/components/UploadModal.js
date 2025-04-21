import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Assuming Modal component is in the same directory

export default function UploadModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    file: null,
    title: '',
    description: '',
    password: '' // Keep initial value as empty string
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [xhrRequest, setXhrRequest] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const resetFormState = () => {
    setFormData({ file: null, title: '', description: '', password: '' });
    setIsLoading(false);
    setUploadProgress(0);
    setUploadResult(null);
    setError(null);
    setXhrRequest(null);
    setVideoUrl('');
    setIsCopied(false);
    const fileInput = document.querySelector('input[name="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleClose = () => {
    if (isLoading && xhrRequest) {
      xhrRequest.abort();
      console.log('Upload cancelled by user.');
    }
    resetFormState();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Additional client-side check (though 'required' handles most cases)
    if (!formData.file || !formData.title || !formData.description || !formData.password) {
        setError("Please fill in all required fields.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    setUploadResult(null);
    setVideoUrl('');
    setIsCopied(false);

    try {
      const authToken = getCookie('authToken');
      if (!authToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const apiFormData = new FormData();
      apiFormData.append('file', formData.file);
      apiFormData.append('title', formData.title);
      apiFormData.append('description', formData.description);
      apiFormData.append('password', formData.password); // Password is required now

      const xhr = new XMLHttpRequest();
      setXhrRequest(xhr);

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        setXhrRequest(null);
        if (xhr.status >= 200 && xhr.status < 300) {
          const result = JSON.parse(xhr.responseText);
          setUploadResult(result);
          setIsLoading(false);
          setUploadProgress(100);

          const videoId = result?.data?.video?.video_id;
          if (videoId) {
            const siteDomain = window.location.origin;
            setVideoUrl(`${siteDomain}/video/${videoId}`);
          } else {
             console.error("Upload successful, but couldn't find video ID in response:", result);
             setError("Upload complete, but couldn't generate the share link.");
          }
        } else {
          let errorMsg = 'Failed to upload video';
          try {
            const result = JSON.parse(xhr.responseText);
             errorMsg = result?.errors?.detail || result?.message || `Server error: ${xhr.status}`;
          } catch (parseError) {
            errorMsg = `Server error: ${xhr.status} - ${xhr.statusText}`;
          }
          setError(errorMsg);
          setIsLoading(false);
          setUploadProgress(0);
        }
      });

      xhr.addEventListener('error', () => {
        setXhrRequest(null);
        console.error('Upload error (network or CORS):', xhr.statusText);
        setError('Upload failed due to a network error or configuration issue.');
        setIsLoading(false);
        setUploadProgress(0);
      });

       xhr.addEventListener('abort', () => {
        setXhrRequest(null);
        console.log('Upload aborted.');
        setIsLoading(false);
        setUploadProgress(0);
      });

      xhr.open('POST', 'https://api.ambientlightfilm.net/api/videos', true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      xhr.send(apiFormData);

    } catch (err) {
      console.error('Upload setup error:', err);
      setError(err.message || 'An unexpected error occurred before uploading.');
      setIsLoading(false);
      setUploadProgress(0);
      setXhrRequest(null);
    }
  };

  const handleCopyLink = () => {
    if (!videoUrl) return;

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

  useEffect(() => {
    return () => {
      if (xhrRequest) {
        xhrRequest.abort();
        console.log('Upload cancelled due to component unmount.');
      }
    };
  }, [xhrRequest]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold text-white">
                {uploadResult ? 'Upload Complete' : 'Upload Video'}
            </h2>
             <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* --- Success View --- */}
        {uploadResult && !error && (
          <div className=" bg-opacity-25 rounded-md space-y-4">
            <div>
                <p className="text-blue-200 text-sm">Your video "{uploadResult.data?.video?.title || 'video'}" is ready.</p>
            </div>

            {videoUrl && (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                    Shareable Video Link
                    </label>
                    <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={videoUrl}
                        readOnly
                        className="flex-grow bg-gray-900 border border-gray-700 text-gray-400 px-3 py-2 rounded-md focus:outline-none text-sm"
                        aria-label="Video Share Link"
                    />
                    <button
                        type="button"
                        onClick={handleCopyLink}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center justify-center min-w-[70px] ${
                        isCopied
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                        }`}
                        aria-live="polite"
                    >
                        {isCopied ? ( /* Copied Icon/Text */
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                        </>
                        ) : ( /* Copy Icon/Text */
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
            {error && (
                 <p className="text-red-400 text-sm">{error}</p>
            )}
             <div className="flex justify-end pt-2">
                 <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    Close
                </button>
            </div>
          </div>
        )}

        {/* --- Error View --- */}
        {error && !uploadResult && (
          <div className="bg-red-800 bg-opacity-25 border border-red-700 rounded-md p-4 mb-4 space-y-3">
            <h3 className="text-red-400 font-semibold">Upload Failed</h3>
            <p className="text-red-200 text-sm">{error}</p>
            <div className="flex justify-end">
                <button
                 onClick={() => {setError(null); setUploadProgress(0); setIsLoading(false);}}
                className="rounded-md bg-gray-700 px-3 py-1 text-sm font-medium text-gray-200 hover:bg-gray-600"
                >
                    Try Again
                </button>
            </div>
          </div>
        )}

        {/* --- Upload Form (shown initially and during loading) --- */}
        {!uploadResult && !error && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Video File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="fileInput">
                Video File *
              </label>
              <input
                id="fileInput"
                type="file"
                name="file"
                accept="video/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gray-800 file:text-blue-400
                  hover:file:bg-gray-700 cursor-pointer
                  bg-gray-800 border border-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                required // Keep required
                disabled={isLoading}
              />
            </div>

            {/* Video Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="titleInput">
                Video Title *
              </label>
              <input
                id="titleInput"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
                required // Keep required
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="descriptionInput">
                Description *
              </label>
              <textarea
                id="descriptionInput"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
                required // Keep required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              {/* 1. Updated Label */}
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="passwordInput">
                Password *
              </label>
              <input
                id="passwordInput"
                type="password"
                name="password"
                // 2. Updated Placeholder (optional, could remove entirely)
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
                // 3. Added required attribute back
                required
                disabled={isLoading}
              />
            </div>

            {/* --- Progress Indicator --- */}
            {isLoading && ( /* Progress Bar JSX */
              <div className="pt-2">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-150 ease-linear"
                    style={{ width: `${uploadProgress}%` }}
                    role="progressbar"
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                 <p className="text-center text-xs text-gray-300 mt-1">{uploadProgress}% Uploaded</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 border border-gray-700"
              >
                {isLoading ? 'Cancel Upload' : 'Cancel'}
              </button>
              <button
                type="submit"
                // 4. Updated disabled check for submit button
                disabled={isLoading || !formData.file || !formData.title || !formData.description || !formData.password}
                className="min-w-[90px] rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? ( /* Loading Icon/Text */
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