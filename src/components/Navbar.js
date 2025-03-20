import React from 'react'

function Navbar() {
  return (
    <>
        {/* Navigation */}
        <nav className="px-6 py-4 backdrop-blur-md bg-black/30 sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                VideoVerse
                </div>
                <div className="hidden md:flex space-x-6">
                <a href="#" className="hover:text-purple-400 transition-colors">Discover</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Trending</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Categories</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Creators</a>
                </div>
            </div>
        </nav>
    </>
  )
}

export default Navbar