import React from 'react'

import './FilmCard.css'
import Link from 'next/link';
import Image from 'next/image';

function AnimatedFilmCard({film}) {
  return (
    <Link href={`/film/${film.id}`}>
        <div className="card aspect-[16/9] relative bg-black rounded-xl overflow-hidden hover:overflow-visible cursor-pointer">
            <div className="wrapper">
                <Image
                    src={film.thumbnail}
                    alt={film.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <img src={film.titleImage} className="title" />
            <img src={film.characterImage} className="character"/>
        </div>
    </Link>
  )
}

export default AnimatedFilmCard