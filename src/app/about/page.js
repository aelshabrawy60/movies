"use client"
import Team from '@/components/Team'
import React from 'react'
import { motion } from 'framer-motion'
import Hero2 from '@/components/Hero2'

function page() {
  const decorativeVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  const lineVariants = {
    hidden: { 
      height: 0,
      opacity: 0
    },
    visible: {
      height: 160,
      opacity: 0.2,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      <Hero2 title={"About Us"} img={'julia-four.webp'}/>
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"
            variants={decorativeVariants}
            initial="hidden"
            animate="visible"
          />
          <motion.div 
            className="absolute -bottom-20 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"
            variants={decorativeVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <motion.div 
            className="space-y-8 sm:space-y-12 pt-12 sm:pt-20"
            variants={contentVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="relative">
              <motion.div 
                className="absolute -left-2 sm:-left-4 top-0 w-px bg-white/20"
                variants={lineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              />
              <motion.h2 
                className="text-3xl sm:text-4xl md:text-5xl font-light mb-8 sm:mb-16 tracking-wide pl-4 sm:pl-0"
                variants={textVariants}
              >
                Our Story
              </motion.h2>
              <div className="space-y-6 sm:space-y-8 max-w-3xl pl-4 sm:pl-0">
                <motion.p 
                  className="text-white/70 text-base sm:text-lg leading-relaxed font-light"
                  variants={textVariants}
                >
                  Founded with a passion for storytelling and visual artistry, our company has evolved into a leading force in film production and distribution. We believe in the power of cinema to inspire, challenge, and connect people across cultures and boundaries.
                </motion.p>
                <motion.p 
                  className="text-white/70 text-base sm:text-lg leading-relaxed font-light"
                  variants={textVariants}
                >
                  With years of experience in the industry, we've built a reputation for creating compelling content that resonates with audiences worldwide. Our team combines creative vision with technical excellence to bring unique stories to life.
                </motion.p>
              </div>
            </div>
          </motion.div>

          <div className="relative">
            <Team />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
