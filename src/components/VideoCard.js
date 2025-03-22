"use client"
import React, { useState } from 'react';
import { FaChartBar } from "react-icons/fa6";
import { FaPlay, FaEye } from "react-icons/fa6";

function VideoCard({ videoData, onPlay = () => {}, onViewStats = () => {} }) {
  return (
    <div className="flex flex-col gap-3 cursor-pointer group">
      {/* Video thumbnail container */}
      <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Thumbnail */}
        <div className="aspect-video bg-gray-900 relative overflow-hidden">
          <img 
            src={videoData.thumbnail} 
            alt={`Thumbnail for ${videoData.title}`}
            className="w-full h-full object-cover"
          />
          
          {/* Play and Stats overlay on hover */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-4">

                {/* Stats button */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onViewStats();
                }}
                className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300"
              >
                <FaChartBar className="text-white" size={18} />
              </div>
              
              {/* Play button */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay();
                }} 
                className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300"
              >
                <FaPlay className="text-white ml-1" size={18} />
              </div>
              
              
            </div>
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {videoData.duration}
          </div>
        </div>
        
        {/* Gradient overlay for text readability */}
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        
        {/* Video info */}
        <div className="absolute bottom-0 w-full p-4 text-left">
          <h1 className="text-lg sm:text-lg font-bold mb-2 text-white line-clamp-2">{videoData.title}</h1>
          <div className="flex items-center text-gray-300 space-x-3">
            <span className="text-sm font-sm">{videoData.creator}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <FaEye className="text-gray-400" size={12} />
              10.2K views
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;