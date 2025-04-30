import React from 'react'

function HeroFilmCard({film}) {
  return (
    <div className='w-[80px] h-[100px] sm:w-[120px] sm:h-[160px] rounded-md overflow-hidden'>
        <img src={film.thumbnail} className='w-full h-full object-cover'></img>
    </div>
  )
}

export default HeroFilmCard
