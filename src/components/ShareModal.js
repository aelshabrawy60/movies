import { useEffect, useState } from "react";
import Modal from "./Modal";
import ShareableLink from "./ShareableLink";


export default function ShareModal({ isOpen, onClose, video, onSave }) {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      plain_password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [links, setLinks] = useState([]);
    const [generatingLink, setGeneratingLink] = useState(false);
    const [linkDuration, setLinkDuration] = useState(3); // Default to 3 hours
    const [durationError, setDurationError] = useState("");
  
    // Fetch links when modal opens
    useEffect(() => {
      if (isOpen && video?.id) {
        fetchVideoLinks();
      }
    }, [isOpen, video]);
  
    const getCookie = (name) => {
      if (typeof document === 'undefined') return null; // Guard against SSR
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
  
    const fetchVideoLinks = async () => {
        setLoading(true);
        setError(null);
      
        try {
          const token = getCookie('authToken');
          const response = await fetch(`https://api.ambientlightfilm.net/api/videos/${video.id}/links`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
      
          const data = await response.json();
      
          if (data.status === 'success') {
            setLinks(data.data.links.reverse());
          } else {
            setError(data.message || 'Failed to fetch links');
          }
        } catch (err) {
          setError('Error fetching links. Please try again.');
          console.error('Error fetching links:', err);
        } finally {
          setLoading(false);
        }
    };
      
  
    // Function to create a new link
    const createNewLink = async () => {
      // Validate duration
      if (linkDuration <= 0) {
        setDurationError("Duration must be greater than 0 hours");
        return;
      }
      
      setDurationError("");
      setGeneratingLink(true);
      setError(null);
      
      try {
        const token = getCookie('authToken');
        
        const response = await fetch(`https://api.ambientlightfilm.net/api/videos/${video.id}/generate-link`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            minutes: linkDuration
          })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
          fetchVideoLinks(); // Refresh links after generating a new one
        } else {
          setError(data.message || 'Failed to generate link');
        }
      } catch (err) {
        setError('Error generating link. Please try again.');
        console.error('Error generating link:', err);
      } finally {
        setGeneratingLink(false);
      }
    };
  
    const handleDurationChange = (e) => {
      const value = e.target.value;
      // Only allow numbers
      if (true) {
        setLinkDuration(parseFloat(value));
        if (parseFloat(value) > 0) {
          setDurationError("");
        }
      }
    };

    function handleDeleteLink(){
        fetchVideoLinks()
    }
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Share video</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          {/* Show error if any */}
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 p-3 rounded mb-4">
              {error}
            </div>
          )}
  
          {/* Generate new link section */}
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Generate New Link</h3>
            <div className="flex items-center mb-4">
              <label className="text-gray-300 mr-3">Link Duration (minutes):</label>
              <div className="flex-1">
                <input 
                  type="number" 
                  value={linkDuration} 
                  onChange={handleDurationChange}
                  className="bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  placeholder="Enter minutes"
                />
                {durationError && (
                  <p className="text-red-400 text-sm mt-1">{durationError}</p>
                )}
              </div>
            </div>
            <button
              onClick={createNewLink}
              disabled={generatingLink || linkDuration <= 0}
              className={`${
                generatingLink || linkDuration <= 0 ? 'bg-blue-500 opacity-70 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium py-2 px-4 rounded transition-colors w-full flex justify-center items-center`}
            >
              {generatingLink ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div> 
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </button>
          </div>
  
          {/* Links section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-3">Shareable Links</h3>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-400">Loading links...</p>
              </div>
            ) : links.length > 0 ? (
              <div className="space-y-3 mb-4">
                {links.map(link => (
                  <ShareableLink 
                    key={link.id}
                    id={link.token}
                    expireDate={link.expires_at}
                    onDelete={handleDeleteLink}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 mb-4">No shareable links available for this video.</p>
            )}
          </div>
        </div>
      </Modal>
    );
  }