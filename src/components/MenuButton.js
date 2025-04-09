// components/MenuButton.jsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Animation variants for menu items
  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, y: 20 }
  };

  const menuItems = [
    { title: "Home", href: "/" },
    { title: "Films", href: "/film" },
    { title: "About us", href: "/about" },
  ];

  return (
    <div className="relative z-50">
      <motion.button 
        className={`flex flex-col justify-center items-center bg-transparent border-none cursor-pointer p-0 z-50 ${isOpen ? 'fixed right-4 top-6' : 'relative'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="Main menu"
      >
        <div className="w-10 h-10 relative flex items-center justify-center">
          {/* First line */}
          <motion.span 
            className="absolute h-0.5 bg-white rounded-full"
            initial={{ width: "50%" }}
            animate={{ 
              width: isOpen ? "70%" : ["50%", "60%", "50%"],
              rotate: isOpen ? 45 : 0,
              translateY: isOpen ? 0 : -8,
              left: isOpen ? "15%" : "25%"
            }}
            transition={{ 
              duration: 0.4,
              rotate: { duration: 0.3 },
              translateY: { duration: 0.3 },
              width: { duration: 0.3, repeat: isOpen ? 0 : Infinity, repeatType: "reverse", repeatDelay: 1 }
            }}
          ></motion.span>
          
          {/* Middle line */}
          <motion.span 
            className="absolute h-0.5 bg-white rounded-full"
            initial={{ width: "60%" }}
            animate={{ 
              width: isOpen ? 0 : "60%",
              translateX: isOpen ? 20 : 0,
              opacity: isOpen ? 0 : 1
            }}
            transition={{ duration: 0.3 }}
          ></motion.span>
          
          {/* Last line */}
          <motion.span 
            className="absolute h-0.5 bg-white rounded-full"
            initial={{ width: "50%" }}
            animate={{ 
              width: isOpen ? "70%" : ["50%", "40%", "50%"],
              rotate: isOpen ? -45 : 0,
              translateY: isOpen ? 0 : 8,
              left: isOpen ? "15%" : "25%"
            }}
            transition={{ 
              duration: 0.4,
              rotate: { duration: 0.3 },
              translateY: { duration: 0.3 },
              width: { duration: 0.3, repeat: isOpen ? 0 : Infinity, repeatType: "reverse", repeatDelay: 1.5 }
            }}
          ></motion.span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.nav 
              className="text-center w-full max-w-lg mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ul className="list-none p-0 m-0">
                {menuItems.map((item, i) => (
                  <motion.li 
                    key={i}
                    custom={i}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="my-8"
                  >
                    <a 
                      href={item.href} 
                      className="text-white no-underline text-4xl font-light tracking-wide hover:text-gray-400 transition-colors duration-300 block py-2"
                      onClick={toggleMenu}
                    >
                      {item.title}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
