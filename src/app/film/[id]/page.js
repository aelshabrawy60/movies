'use client';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import MenuButton from '@/components/MenuButton';
import filmsData from '@/data/films.json';

export default function FilmPage() {
  const params = useParams();

  const film = filmsData.films.find(f => f.id === parseInt(params.id));

  if (!film) {
    return <div>Film not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <div className="fixed top-4 sm:top-5 left-4 sm:left-5 z-50">
        <MenuButton />
      </div>

      {/* Back Button */}
      <Link href="/film" className="fixed top-4 sm:top-5 right-4 sm:right-5 z-50">
        <motion.button
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Films
        </motion.button>
      </Link>

      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={film.thumbnail}
            alt={film.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50 md:via-black/60 md:to-black/20" />
        </div>

        {/* Content */}
        <div className="relative min-h-screen flex items-center">
          <motion.div 
            className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Genre Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {film.genres.map((genre, index) => (
                <span 
                  key={index}
                  className="px-2.5 sm:px-4 py-1 text-xs sm:text-sm bg-white/10 backdrop-blur-sm rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Title */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3">
                {film.title}
              </h1>
              <div className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-400">
                {film.year}
              </div>
            </div>

            {/* Film Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Synopsis</h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {film.fullDescription}
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">Director</h2>
                  <p className="text-sm sm:text-base text-gray-300">{film.director}</p>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">Cast</h2>
                  <div className="flex flex-wrap gap-2">
                    {film.cast.map((actor, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-sm bg-white/5 rounded-lg text-gray-300"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">Duration</h2>
                  <div className="flex items-center text-sm sm:text-base text-gray-300">
                    <svg 
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {film.duration}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
