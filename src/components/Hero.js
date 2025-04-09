"use client"

import React, { useState, useEffect } from 'react'
import MouseScroll from './MouseScroll'
import Slider from './Slider';
import films from '../data/films.json';

function Hero() {
  const sortedFilms = [...films.films]
  const images = sortedFilms.map(film => film.thumbnail);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIndices, setActiveIndices] = useState([0]); // Track all visible images
  
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
        <img src='/ambient-light-logo.svg' width={450} alt="Logo"></img>
      </div>
      {/* Position the Slider on the right with padding */}
      <div className='absolute top-1/2 -translate-y-1/2 right-2 z-40 p-4 hidden md:block'> 
        <Slider 
          films={sortedFilms}
          currentIndex={currentIndex} 
          slideTheImage={slideTheImage}
        />
      </div>
      {/* Bottom slider for mobile */}
      <div className='absolute bottom-0 left-0 right-0 z-40 p-4 md:hidden'> 
        <Slider 
          films={sortedFilms}
          currentIndex={currentIndex} 
          slideTheImage={slideTheImage}
        />
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
              <img 
                src={image} 
                className='w-full h-full object-cover'
                style={{
                  transition: 'transform 7000ms ease-out',
                  transform: isVisible ? 'scale(1.05)' : 'scale(1)'
                }}
                alt={`Background ${index + 1}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Hero
