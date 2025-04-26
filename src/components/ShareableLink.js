import React, { useEffect, useState } from 'react';

function ShareableLink({ id, expireDate, onDelete }) {
  const [isCopied, setIsCopied] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    // Construct the video URL using the provided id
    const siteDomain = typeof window !== 'undefined' ? window.location.origin : '';
    if (siteDomain && id) {
      setVideoUrl(`${siteDomain}/watch/${id}`);
    } else {
      setVideoUrl(''); // Reset if missing parts
    }
  }, [id]);
  
  const handleCopyLink = () => {
    if (!videoUrl || !navigator.clipboard) return; // Check for clipboard support
    
    navigator.clipboard.writeText(videoUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy video link: ', err);
      });
  };
  
  const handleDeleteLink = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      const token = getCookie('authToken');
      
      const response = await fetch(`https://api.ambientlightfilm.net/api/videos/link/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Notify parent component to update the links list
        if (onDelete) {
          onDelete(id);
        }
      } else {
        console.error('Failed to delete link:', data.message);
      }
    } catch (err) {
      console.error('Error deleting link:', err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const getCookie = (name) => {
    if (typeof document === 'undefined') return null; // Guard against SSR
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  
  // Format expiration date in a user-friendly way
  const formatExpireDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const expireDate = new Date(dateString+'Z'); // Ensure UTC format
    console.log("expireDate", expireDate)
    const now = new Date();
    
    // Calculate difference in milliseconds
    const diffMs = expireDate - now;
    
    // Convert to hours, minutes
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format date for display
    const options = { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    const formattedDate = expireDate.toLocaleDateString(undefined, options);
    
    // If expired
    if (diffMs < 0) {
      return `Expired on ${formattedDate}`;
    }
    
    // If less than 24 hours
    if (diffHours < 24) {
      return `Expires in ${diffHours}h ${diffMinutes}m (${formattedDate})`;
    }
    
    // If more than 24 hours
    const diffDays = Math.floor(diffHours / 24);
    return `Expires in ${diffDays} day${diffDays !== 1 ? 's' : ''} (${formattedDate})`;
  };
  
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-md p-3 mb-3">
      <div className="flex items-center  space-x-2 mb-2">
        <input
          type="text"
          value={videoUrl}
          readOnly
          className="flex-grow bg-gray-900 border border-gray-700 text-gray-400 px-3 py-2 rounded-md focus:outline-none text-sm truncate"
          aria-label="Video Share Link"
        />
        <button
          type="button"
          onClick={handleCopyLink}
          className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center justify-center ${
            isCopied
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
          }`}
        >
          {/* Copy Icon / Copied State */}
          {isCopied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleDeleteLink}
          disabled={isDeleting}
          className="flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 bg-red-800 hover:bg-red-700 text-white flex items-center justify-center"
        >
          {isDeleting ? (
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
      <div className="text-sm text-gray-400">
        {formatExpireDate(expireDate)}
      </div>
    </div>
  );
}

export default ShareableLink;