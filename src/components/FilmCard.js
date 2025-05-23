'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaPen, FaTrashAlt, FaEllipsisV } from 'react-icons/fa';

export default function FilmCard({ film, isEditable = false, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  
  return (
    <Link href={`/film/${film.id}`}>
      <motion.div
        className="relative bg-black rounded-xl overflow-hidden group cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Options Menu Button (only shown when editable) */}
        {isEditable && (
          <div className="absolute top-2 right-2 z-10">
            <button
              className="menu-button bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <FaEllipsisV size={16} />
            </button>
            
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div
                className="dropdown-menu absolute bg-white rounded-lg shadow-xl py-2 min-w-[140px] z-50"
                style={{
                  top: '40px',
                  right: '0px'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(film);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaPen size={14} />
                  Edit Film
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(film.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaTrashAlt size={14} />
                  Delete Film
                </button>
              </div>
            )}
          </div>
        )}

        {/* Image Container */}
        <div className="aspect-[16/9] relative">
          <Image
            src={film.image}
            alt={film.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70" />
        </div>
        
        {/* Content Container */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
            {film.genre.split(',').map(item => item.trim()).map((genre, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
          
          {/* Title and Year */}
          <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 transition-colors">
            {film.title}
            <span className="ml-2 text-lg font-normal text-gray-400">
              {film.release_year}
            </span>
          </h2>
          
          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-300 mb-2 line-clamp-2">
            {film.synopsis}
          </p>
          
          {/* Duration */}
          <div className="flex items-center text-xs sm:text-sm text-gray-400">
            <svg
              className="w-4 h-4 mr-1"
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
      </motion.div>
    </Link>
  );
}