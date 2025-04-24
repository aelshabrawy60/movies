// VideoPlayer.jsx (Client Component)
import { useState, useEffect, useRef } from 'react';
import { RiPlayLargeFill } from "react-icons/ri";
import useVdocipher from '../hooks/use-vdocipher'

export default function VideoPlayer({ video }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { loadVideo, isAPIReady } = useVdocipher();
  const videoContainerRef = useRef(null);
  const [videoRef, setVideoRef] = useState(null);
  const [player, setPlayer] = useState(null);
  
  // Track play time
  const totalPlayedRef = useRef(0);
  const totalCoveredRef = useRef(0);
  const trackingIntervalRef = useRef(null);
  
  const handlePlay = () => {
    setIsPlaying(true);
  };

  // Load the video when play is clicked
  useEffect(() => {
    if (isPlaying && isAPIReady && videoContainerRef.current && !videoRef) {
      // Create and load the video
      const iframe = loadVideo({
        otp: video.otp,
        playbackInfo: video.playbackInfo,
        container: videoContainerRef.current,
        configuration: {
          autoplay: true,
          primaryColor: "4245EF"
        }
      });
      
      setVideoRef(iframe);
    }
  }, [isPlaying, isAPIReady, video, loadVideo, videoRef]);

  // Initialize player when video iframe is loaded
  useEffect(() => {
    if (!isAPIReady || !videoRef) return;
    
    try {
      const vdoPlayer = new window.VdoPlayer(videoRef);
      setPlayer(vdoPlayer);
      
      // Set up tracking interval
      trackingIntervalRef.current = setInterval(async () => {
        try {
          totalPlayedRef.current = await vdoPlayer.api.getTotalPlayed();
          totalCoveredRef.current = await vdoPlayer.api.getTotalCovered();
        } catch (error) {
          console.error("Error tracking video metrics:", error);
        }
      }, 1000);
      
      // Video event listeners
      vdoPlayer.video.addEventListener("play", () => console.log("Video playing"));
      vdoPlayer.video.addEventListener("pause", () => console.log("Video paused"));
      vdoPlayer.video.addEventListener("ended", () => {
        console.log("Video ended");
        sendTrackingData();
      });
      
    } catch (error) {
      console.error("Error initializing player:", error);
    }
    
    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
      
      // Send tracking data when component unmounts
      if (totalPlayedRef.current > 0) {
        sendTrackingData();
      }
    };
  }, [videoRef, isAPIReady]);
  
  // Function to send tracking data to API
  const sendTrackingData = async () => {
    if (totalPlayedRef.current <= 0 && totalCoveredRef.current <= 0) return;
    
    try {
      const response = await fetch('/api/track-video-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoId: video.id,
          totalPlayed: totalPlayedRef.current,
          totalCovered: totalCoveredRef.current
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      console.log("Tracking data sent:", {
        videoId: video.id, 
        totalPlayed: totalPlayedRef.current, 
        totalCovered: totalCoveredRef.current
      });
    } catch (error) {
      console.error("Failed to send tracking data:", error);
    }
  };

  // Handle page unload/navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
      
      // Use sendBeacon for more reliable data transmission during page unload
      if (navigator.sendBeacon && totalPlayedRef.current > 0) {
        const blob = new Blob([JSON.stringify({
          videoId: video.id,
          totalPlayed: totalPlayedRef.current,
          totalCovered: totalCoveredRef.current
        })], {type: 'application/json'});
        
        navigator.sendBeacon('/api/track-video-time', blob);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [video.id]);

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
          <div 
            ref={videoContainerRef} 
            className="w-full h-full border-0"
          ></div>
        )}
        
        {!isPlaying && (
          <div className="absolute bottom-0 w-full p-4 md:p-6 text-left hidden md:block">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{video.title}</h1>
            <div className="flex items-center text-gray-300 space-x-4 mb-2">
              <span>{video.creator}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}