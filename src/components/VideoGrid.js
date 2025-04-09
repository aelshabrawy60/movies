import { useState } from 'react';
import VideoCard from "./VideoCard";
import StatsModal from "./StatsModal";
import EditVideoModal from "./EditVideoModal";

// components/VideoGrid.js
export default function VideoGrid() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  
  // Mock data - in a real app, this would come from an API
  const videos = [
    {
      id: 2,
      creator: "Fight Club",
      title: 'Tailwind CSS Tutorial',
      description: 'Learn how to build modern UIs with Tailwind CSS. This comprehensive tutorial covers the basics to advanced concepts.',
      views: 3456,
      duration: '12:45',
      thumbnail: '/arze.webp',
      password: 'video123'
    },
    {
      id: 3,
      creator: "WebDev Pro",
      title: 'React Hooks Explained',
      description: 'Deep dive into React Hooks. Understanding useState, useEffect, and custom hooks with practical examples.',
      views: 2100,
      duration: '8:15',
      thumbnail: '/cz-two.jpg',
      password: 'hooks123'
    },
    {
      id: 4,
      creator: "UI Master",
      title: 'Build a Dashboard UI',
      description: 'Step-by-step guide to creating a professional dashboard interface using modern web technologies.',
      views: 1876,
      duration: '15:20',
      thumbnail: '/julia-four.webp',
      password: 'dash123'
    },
    {
      id: 5,
      creator: "Tech Solutions",
      title: 'API Integration Best Practices',
      description: 'Learn the best practices for integrating APIs in your web applications for optimal performance.',
      views: 980,
      duration: '10:10',
      thumbnail: '/52blue-three.webp',
      password: 'api123'
    },
    {
      id: 6,
      creator: "Fight Club",
      title: 'Tailwind CSS Tutorial',
      description: 'Learn how to build modern UIs with Tailwind CSS. This comprehensive tutorial covers the basics to advanced concepts.',
      views: 3456,
      duration: '12:45',
      thumbnail: '/julia-four.webp',
      password: 'video123'
    },
    {
      id: 7,
      creator: "WebDev Pro",
      title: 'React Hooks Explained',
      description: 'Deep dive into React Hooks. Understanding useState, useEffect, and custom hooks with practical examples.',
      views: 2100,
      duration: '8:15',
      thumbnail: '/cz-two.jpg',
      password: 'hooks123'
    },
    {
      id: 8,
      creator: "UI Master",
      title: 'Build a Dashboard UI',
      description: 'Step-by-step guide to creating a professional dashboard interface using modern web technologies.',
      views: 1876,
      duration: '15:20',
      thumbnail: '/arze.webp',
      password: 'dash123'
    },
    {
      id: 9,
      creator: "Tech Solutions",
      title: 'API Integration Best Practices',
      description: 'Learn the best practices for integrating APIs in your web applications for optimal performance.',
      views: 980,
      duration: '10:10',
      thumbnail: '/arze.webp',
      password: 'api123'
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map(video => (
          <VideoCard 
            key={video.id} 
            videoData={video}
            onViewStats={() => setSelectedVideo(video)}
            onEdit={() => setEditingVideo(video)}
            onDelete={() => {
              // Here you would typically make an API call to delete the video
              // For now, we'll just log it
              console.log('Delete video:', video.id);
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
          // Here you would typically make an API call to update the video
          // For now, we'll just log it
          console.log('Update video:', editingVideo?.id, updatedData);
          setEditingVideo(null);
        }}
      />
    </>
  );
}
