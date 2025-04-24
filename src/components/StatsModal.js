import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import VideoStats from './VideoStats';

export default function StatsModal({ isOpen, onClose, video }) {
  const [videoStats, setVideoStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && video?.id) {
      fetchVideoStats(video.id);
    }
  }, [isOpen, video]);

  const fetchVideoStats = async (videoId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the auth token from cookies
      const authToken = getCookie('authToken');
      
      const response = await fetch(`https://api.ambientlightfilm.net/api/videos/${videoId}/stats`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch video statistics');
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setVideoStats(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch video statistics');
      }
    } catch (err) {
      console.error('Error fetching video stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Video Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg text-white">{video?.title}</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 py-4">{error}</div>
        ) : (
          <VideoStats stats={videoStats} />
        )}
      </div>
    </Modal>
  );
}