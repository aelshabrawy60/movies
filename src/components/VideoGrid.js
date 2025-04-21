import { useState, useEffect } from 'react';
import VideoCard from "./VideoCard";
import StatsModal from "./StatsModal";
import EditVideoModal from "./EditVideoModal";

// Helper function to get the auth token from cookies
function getAuthToken() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; authToken=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// components/VideoGrid.js
export default function VideoGrid() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchVideos() {
      try {
        const authToken = getAuthToken();
        
        if (!authToken) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        const response = await fetch('https://api.ambientlightfilm.net/api/videos', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
          setVideos(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch videos');
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchVideos();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading videos...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (videos.length === 0) {
    return <div className="text-center py-10">No videos found.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map(video => (
          <VideoCard 
            key={video.id} 
            videoData={{
              ...video,
              creator: "Ambient Light Film", // Default value
              views: 0, // Default value
              duration: '00:00', // Default value
              thumbnail: `/thumbnails/${video.video_id}.jpg`, // Assumed path
              password: '' // Default value
            }}
            onViewStats={() => setSelectedVideo(video)}
            onEdit={() => setEditingVideo(video)}
            onDelete={() => {
              if (confirm('Are you sure you want to delete this video?')) {
                console.log('Video deleted:', video.id);
              }
            }}
          />
        ))}
      </div>

      <StatsModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        video={selectedVideo || {}}
      />

      <EditVideoModal
        isOpen={!!editingVideo}
        onClose={() => setEditingVideo(null)}
        video={editingVideo}
        onSave={(updatedData) => {
          console.log('Update video:', editingVideo?.id, updatedData);
          setEditingVideo(null);
        }}
      />
    </>
  );
}