'use client';

import { motion } from 'framer-motion';

export default function AnimatedTitle() {
  return (
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
  );
}
