"use client";
import Footer from '@/components/Footer';
import Navbar from '@/components/navbar';
import React, { useState } from 'react';
import { FiPlay } from 'react-icons/fi';

const video = {
    id: 5,
    title: "Trianto appelomng termanati",
    creator: "Fight Club",
    views: "1.3M",
    thumbnail: "/11-Fight-Club-MSDFICL_EC006-H-2023.jpg",
    youtubeId: "chyRpj-971o", // Add your actual YouTube video ID here
    duration: "4:05",
    description: "Experience the tranquil sounds of rain falling in a dense forest. Perfect for relaxation, meditation, or as a soothing background while you work or study. Recorded in the pristine wilderness of the Pacific Northwest."
}

function VideoClipPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 md:via-[#350854] to-gray-900 text-white">
        
      <Navbar/>
      <main className="w-full sm:px-4 sm:py-6 md:py-8 flex flex-col items-center flex-1">
        <div className="w-full max-w-5xl">
          
          <div className="relative sm:rounded-xl md:rounded-2xl sm:overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl ring-1 ring-purple-500/20">
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
                      className="bg-purple-600/90 hover:bg-purple-500 p-3 sm:p-4 md:p-6 rounded-full transform transition-transform group-hover:scale-110"
                      onClick={handlePlay}
                    >
                      <FiPlay className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8"/>
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

          <div className="md:hidden bg-gray-900/95 rounded-b-lg shadow-md ">
            <div className="px-4 pt-4 pb-2">
              <h1 className="text-xl font-bold mb-2 leading-tight">{video.title}</h1>
              <div className="flex items-center justify-between text-gray-300 mb-1">
                <span className="font-medium">{video.creator}</span>
                <span className="text-sm bg-gray-800/80 px-2 py-1 rounded-full">{video.duration}</span>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-gray-800">
              <p className="text-sm leading-relaxed text-gray-200">
                {video.description}
              </p>
            </div>
          </div>
          
          <div className="mt-3 md:mt-5 p-3 p-md-6 sm:p-4 bg-gray-800/50 rounded-lg hidden md:block">
            <div className="text-sm sm:text-base text-gray-200">
              <p>{video.description}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  );
}

export default VideoClipPage;