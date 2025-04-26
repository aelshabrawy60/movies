"use client"
import { Share } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useRef } from 'react';
import { FaChartBar, FaPen, FaTrashAlt, FaEye, FaEllipsisV, FaShare } from "react-icons/fa";

function VideoCard({ videoData, onPlay = () => {}, onViewStats = () => {}, onEdit = (videoData) => {}, onDelete = () => {}, onShare = () => {} }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  
  // Close menu when clicking outside
  const closeMenu = (e) => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', closeMenu);
    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, [isMenuOpen]);

  // Handler for clicking the card
  const handleCardClick = () => {
    // Navigate to the video page
    window.location.href = `/video/${videoData.video_id}`;
  };

  return (
    // Parent container with relative positioning for absolute positioning context
    <div className="flex flex-col gap-3 cursor-pointer group relative">
      {/* Video thumbnail container */}
      <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Thumbnail - add onClick here instead */}
        <div 
          className="aspect-video bg-gray-900 relative overflow-hidden"
          onClick={handleCardClick}
        >
          <div className="absolute inset-0">
            <img 
              src={videoData.thumbnail} 
              alt={`Thumbnail for ${videoData.title}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* More options menu - Always visible */}
          <div className="absolute top-3 right-3 z-10">
            <div className="relative">
              <button
                ref={menuButtonRef}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <FaEllipsisV className="text-white" size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Gradient overlay for text readability */}
        <div 
          className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"
          onClick={handleCardClick}
        ></div>
        
        {/* Video info - make this clickable too */}
        <div 
          className="absolute bottom-0 w-full p-4 text-left"
          onClick={handleCardClick}
        >
          <h1 className="text-lg sm:text-lg font-bold mb-2 text-white line-clamp-2">{videoData.title}</h1>
          <div className="flex items-center text-gray-300 space-x-3">
            <span className="text-sm font-sm">{videoData.creator}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <FaEye className="text-gray-400" size={12} />
              {videoData.views_count} views
            </span>
          </div>
        </div>
      </div>

      {/* Click-based dropdown menu */}
      {isMenuOpen && (
        <div 
          className="absolute bg-white rounded-lg shadow-xl py-2 min-w-[140px] z-50"
          style={{
            top: '50px', // Position below the button
            right: '10px'  // Align with the right side of the button
          }}
          onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating
        >
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              onShare();
              setIsMenuOpen(false);
            }}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <FaShare size={14} />
            Share
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              onViewStats();
              setIsMenuOpen(false);
            }}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <FaChartBar size={14} />
            View Stats
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              onEdit(videoData);
              setIsMenuOpen(false);
            }}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <FaPen size={14} />
            Edit Video
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              onDelete();
              setIsMenuOpen(false);
            }}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <FaTrashAlt size={14} />
            Delete Video
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoCard;