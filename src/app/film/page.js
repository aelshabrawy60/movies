'use client';
import { motion } from 'framer-motion';
import FilmCard from '@/components/FilmCard';
import MenuButton from '@/components/MenuButton';
import filmsData from '@/data/films.json';
import AnimatedFilmCard from '@/components/AnimatedFilmCard';

export default function FilmsPage() {
  const films = filmsData.films.map(film => ({
    ...film,
    thumbnail: film.listThumbnail // Use listThumbnail for the grid view
  }));

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <div className="absolute top-5 left-5 z-50">
        <MenuButton />
      </div>

      {/* Page Title */}
      <motion.div 
        className="pt-24 sm:pt-32 pb-8 sm:pb-16 px-4 sm:px-8 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">Our Films</h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
          Explore our collection of groundbreaking films that push the boundaries 
          of storytelling and cinematography.
        </p>
      </motion.div>

      {/* Films Grid */}
      <div className="px-4 sm:px-8 pb-8 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {films.map((film, index) => (
            
              <FilmCard key={index} film={film} />
          ))}
        </div>
      </div>
    </div>
  );
}
