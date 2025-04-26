import { useState, useEffect } from 'react';
import VideoCard from "./VideoCard";
import StatsModal from "./StatsModal";
import EditVideoModal from "./EditVideoModal";
import Modal from "./Modal"; // Assuming the Modal component is reusable
import ShareModal from './ShareModal';

// Helper function to get the auth token from cookies
function getAuthToken() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; authToken=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Skeleton loading component for video cards
function VideoCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
      {/* Thumbnail skeleton */}
      <div className="aspect-video bg-gray-700"></div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, videoTitle, isDeleting }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Delete Video</h3>
          <button
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="text-gray-300">
          <p>Are you sure you want to delete the video <span className="font-semibold">{videoTitle}</span>?</p>
          <p className="mt-2 text-red-400">This action cannot be undone.</p>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 border border-gray-700"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : 'Delete Video'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// components/VideoGrid.js
export default function VideoGrid() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingVideo, setDeletingVideo] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [sharingVideo, setSharingVideo] = useState(null);


  
  useEffect(() => {
    fetchVideos();
  }, []);
  
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

  // Handler for updating video in the UI after edit
  const handleVideoUpdate = (updatedVideo) => {
    fetchVideos();
    setEditingVideo(null);
  };
  
  // Handler for deleting a video
  const handleDeleteVideo = async () => {
    if (!deletingVideo) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await fetch(`https://api.ambientlightfilm.net/api/videos/${deletingVideo.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete video');
      }
      
      if (result.status === 'success') {
        // Remove the deleted video from the videos array
        setVideos(currentVideos => 
          currentVideos.filter(video => video.id !== deletingVideo.id)
        );
        
        // If the deleted video is currently selected in the stats modal, close it
        if (selectedVideo && selectedVideo.id === deletingVideo.id) {
          setSelectedVideo(null);
        }
        
        // Close the delete confirmation modal
        setDeletingVideo(null);
      } else {
        throw new Error(result.message || 'Failed to delete video');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    );
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
              password: '' // Default value
            }}
            onViewStats={() => setSelectedVideo(video)}
            onEdit={() => setEditingVideo(video)}
            onDelete={() => setDeletingVideo(video)}
            onShare={() => setSharingVideo(video)}
          />
        ))}
      </div>

      <ShareModal
        isOpen={!!sharingVideo}
        onClose={() => setSharingVideo(null)}
        video={sharingVideo || {}}
      />


      <StatsModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        video={selectedVideo || {}}
      />

      <EditVideoModal
        isOpen={!!editingVideo}
        onClose={() => setEditingVideo(null)}
        video={editingVideo}
        onSave={handleVideoUpdate}
      />
      
      <DeleteConfirmationModal
        isOpen={!!deletingVideo}
        onClose={() => {
          setDeletingVideo(null);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteVideo}
        videoTitle={deletingVideo?.title || ''}
        isDeleting={isDeleting}
      />
      
      {deleteError && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-md shadow-lg">
          Error: {deleteError}
          <button 
            className="ml-2 font-bold"
            onClick={() => setDeleteError(null)}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}