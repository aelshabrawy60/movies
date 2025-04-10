"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import MouseScroll from './MouseScroll'
import Slider from './Slider';
import films from '../data/films.json';

function Hero() {
  const sortedFilms = [...films.films].slice(0, 3);
  const images = sortedFilms.map(film => film.thumbnail);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIndices, setActiveIndices] = useState([0]); // Track all visible images
  const [loadedImages, setLoadedImages] = useState({}); // Track which images have loaded
  
  useEffect(() => {
    // Start the scaling effect immediately for the first image
    
    // Set up the interval for changing images
    const imageInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);
      
      // Add the new image to active indices
      setActiveIndices(prev => [...prev, nextIndex]);
      
      // Remove the old image after it has faded out completely
      setTimeout(() => {
        setActiveIndices(prev => prev.filter(idx => idx !== currentIndex));
      }, 4000); // Match the opacity transition duration
      
    }, 5500);
    
    return () => clearInterval(imageInterval);
  }, [currentIndex, images.length]);
  

  function slideTheImage(direction){
    // Ensure the index wraps around correctly in both directions
    const nextIndex = (currentIndex + direction + images.length) % images.length;
    setCurrentIndex(nextIndex);
    
    // Add the new image to active indices
    setActiveIndices(prev => [...prev, nextIndex]);

    // Remove the old image after it has faded out completely
    setTimeout(() => {
      setActiveIndices(prev => prev.filter(idx => idx !== currentIndex));
    }, 200); // Match the opacity transition duration
  }
  return (
    <div className='h-screen relative overflow-hidden'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20'>
        <Image src='/ambient-light-logo.svg' width={450} height={450} alt="Logo" priority />
      </div>
      {/* Position the Slider on the right with padding */}
      <div className='absolute top-1/2 -translate-y-1/2 right-4 z-40 p-4 hidden md:block transition-transform duration-500 hover:translate-x-0 translate-x-2'> 
        <Slider 
          films={sortedFilms}
          currentIndex={currentIndex} 
          slideTheImage={slideTheImage}
        />
      </div>
      {/* Bottom slider for mobile - with gradient overlay */}
      <div className='absolute bottom-0 left-0 right-0 z-40 md:hidden'> 
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none'></div>
        <div className='relative p-4'>
          <Slider 
            films={sortedFilms}
            currentIndex={currentIndex} 
            slideTheImage={slideTheImage}
          />
        </div>
      </div>
      <div className='w-full h-full relative overflow-hidden'>
        {images.map((image, index) => {
          const isActive = index === currentIndex;
          const isVisible = activeIndices.includes(index);
          
          return (
            <div 
              key={index}
              className="absolute top-0 left-0 w-full h-full"
              style={{ 
                opacity: isActive ? 0.4 : isVisible ? 0 : 0,
                transition: 'opacity 4000ms ease-in-out',
                zIndex: isActive ? 10 : 5,
                pointerEvents: isVisible ? 'auto' : 'none'
              }}
            >
              <Image
                src={image}
                fill
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  transition: 'all 7000ms ease-out',
                  transform: isVisible ? 'scale(1.05)' : 'scale(1)',
                  opacity: loadedImages[index] ? 1 : 0
                }}
                alt={`Background ${index + 1}`}
                priority={index === 0}
                unoptimized
                onLoadingComplete={() => {
                  setLoadedImages(prev => ({...prev, [index]: true}));
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Hero
