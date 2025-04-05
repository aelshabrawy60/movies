import React, { useState } from 'react';
import VideoStats from './VideoStats';
import { sampleVideoStats } from '@/data/videoStats';

export default function DashboardStats({ videos }) {
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);

  return (
    <div className="mb-8">
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-6 lg:space-y-0">
        {/* Video Selection Panel */}
        <div className="w-full lg:w-1/3 bg-gray-900 rounded-lg border border-gray-800 p-4">
          <h2 className="text-xl font-semibold text-white mb-4">Video Statistics</h2>
          <div className="space-y-2">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedVideo.id === video.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-16 h-9 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium truncate">{video.title}</h3>
                    <p className="text-sm text-gray-400">{video.views.toLocaleString()} views</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Panel */}
        <div className="w-full lg:w-2/3">
          {selectedVideo && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">{selectedVideo.title}</h2>
                <p className="text-gray-400">{selectedVideo.views.toLocaleString()} total views • {selectedVideo.duration} duration</p>
              </div>
              <VideoStats stats={sampleVideoStats} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
