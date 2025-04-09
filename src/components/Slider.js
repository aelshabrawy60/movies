import React, { useState } from 'react'
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import FilmCard from './FilmCard';
import HeroFilmCard from './HeroFilmCard';

function Slider({films, currentIndex, slideTheImage}) {
  const [touchStart, setTouchStart] = useState(null)

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (!touchStart) return

    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) { // minimum swipe distance
      if (diff > 0 && currentIndex < films.length - 1) {
        // Swipe left
        slideTheImage(1)
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right
        slideTheImage(-1)
      }
    }

    setTouchStart(null)
  }

  return (
    <div className='flex items-center md:items-start gap-2 sm:gap-4 md:gap-0 md:flex-col'>
      {/* Film cards */}
      <div 
        className='flex md:flex-col gap-1 md:gap-0.5 overflow-hidden md:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-w-[95vw] sm:max-w-[80vw] md:max-w-[20vw] md:max-h-[80vh] mx-auto'
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {films.map((film, index) => (
          <div 
            key={film.id}
            className={`transform transition-all duration-500 cursor-pointer shrink-0
              ${index === currentIndex ? 'scale-100 opacity-100' : 'scale-95 opacity-50 sm:scale-85 sm:opacity-60'}`}
            onClick={() => {
              if (index !== currentIndex) {
                slideTheImage(index - currentIndex);
              }
            }}
          >
            <HeroFilmCard film={film} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Slider
