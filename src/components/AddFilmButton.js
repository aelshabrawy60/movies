"use client"

import { useState } from 'react';
import AddFilmModal from './AddFilmModal';


export default function AddFilmButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  // Define a handler function for closing the modal
  const handleCloseAndRefresh = () => {
    setIsModalOpen(false); // Close the modal first

    // --- Option 1: Hard Refresh (Standard Browser Behavior) ---
    // This reloads the entire page from the server.
    window.location.reload();

    // --- Option 2: Soft Refresh (Next.js App Router Recommended) ---
    // If you are using the Next.js App Router, this is often preferred.
    // It refetches data for the current route without losing client-side state
    // for uncontrolled components and provides a smoother UX.
    // Uncomment the line below and the `useRouter` import above if using this.
    //router.refresh(); 
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Add Film
      </button>

      <AddFilmModal
        isOpen={isModalOpen}
        onClose={handleCloseAndRefresh} // Pass the new handler function to the onClose prop
      />
    </>
  );
}