// VideoPlayer.jsx (Client Component)
'use client'
import { useState } from 'react';
import { RiPlayLargeFill } from "react-icons/ri";

export default function VideoPlayer({ video }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative sm:rounded-xl md:rounded-2xl sm:overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl ring-1 ring-white/10">
      <div className="aspect-video bg-gray-800 relative group overflow-hidden">
        {!isPlaying ? (
          <>
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="w-full h-full object-cover opacity-80"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-center">
              <button 
                className="bg-blue-600/80 hover:bg-blue-500 p-3 sm:p-4 md:p-6 rounded-full transform transition-transform group-hover:scale-110"
                onClick={handlePlay}
              >
                <RiPlayLargeFill className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8"/>
              </button>
            </div>
          </>
        ) : (
          <iframe 
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
          />
        )}
        
        {!isPlaying && (
          <div className="absolute bottom-0 w-full p-4 md:p-6 text-left hidden md:block">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{video.title}</h1>
            <div className="flex items-center text-gray-300 space-x-4 mb-2">
              <span>{video.creator}</span>
              <span className="text-sm text-gray-400">{video.duration}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}