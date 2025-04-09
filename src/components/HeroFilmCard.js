import React from 'react'

function HeroFilmCard({film}) {
  return (
    <div className='w-[90px] h-[100px] sm:w-[120px] sm:h-[160px] rounded-lg overflow-hidden'>
        <img src={film.poster} className='w-full h-full object-cover'></img>
    </div>
  )
}

export default HeroFilmCard
