import React from 'react'
import MenuButton from './MenuButton'

function Hero2({title, img}) {
  return (
    <div className='h-[40vh] sm:h-[50vh] w-full relative overflow-hidden'>
        <div className="absolute top-5 left-5 w-full h-full">
              <MenuButton/>
        </div>  
        <img src={img} className='w-full h-full object-cover'></img>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% sm:from-55% to-black"></div>
        <div 
            className="text-white text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 sm:px-0 w-full sm:w-auto"
            >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 md:mb-4">{title}</h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            Explore our collection of groundbreaking films that push the boundaries 
            of storytelling and cinematography.
            </p>
        </div>
    </div>
  )
}

export default Hero2
