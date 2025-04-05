import React from 'react';
import Modal from './Modal';
import VideoStats from './VideoStats';
import { sampleVideoStats } from '@/data/videoStats';

export default function StatsModal({ isOpen, onClose, video }) {
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
          <h3 className="text-lg text-white">{video.title}</h3>
          <p className="text-gray-400">Uploaded by {video.creator}</p>
        </div>

        <VideoStats stats={sampleVideoStats} />
      </div>
    </Modal>
  );
}
