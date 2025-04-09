"use client"
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const teamMembers = [
  {
    name: 'John Smith',
    role: 'Creative Director',
    bio: 'Over 15 years of experience in film production and creative direction.',
    image: '/team4.jpg'
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Production',
    bio: 'Award-winning producer with expertise in international co-productions.',
    image: '/team2.jpg'
  },
  {
    name: 'Michael Chen',
    role: 'Technical Director',
    bio: 'Pioneering innovative filming techniques and visual effects solutions.',
    image: '/team3.jpg'
  }
]

function Team() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  const textVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div 
      className="py-12 sm:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.h2 
        className="text-3xl sm:text-4xl font-light mb-8 sm:mb-12 tracking-wide pl-1"
        variants={textVariants}
      >
        Our Team
      </motion.h2>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12"
        variants={containerVariants}
      >
        {teamMembers.map((member, index) => (
          <motion.div 
            key={member.name}
            className="group"
            variants={itemVariants}
            whileHover={{ y: -10 }}
          >
            <motion.div 
              className="relative h-[300px] sm:h-[400px] lg:h-[450px] mb-6 sm:mb-8 overflow-hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={index === 0}
              />
              <motion.div 
                className="absolute inset-0 bg-black/40"
                whileHover={{ opacity: 0.2 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div
              className="px-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <h3 className="text-lg sm:text-xl font-light mb-2 tracking-wide">
                {member.name}
              </h3>
              <p className="text-white/70 mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-widest">{member.role}</p>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-light">{member.bio}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Team
