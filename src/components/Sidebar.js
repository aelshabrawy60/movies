"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronRight, Video, Film, Settings, Key } from 'lucide-react'

const navItems = [
  { name: 'Videos', href: '/dashboard/videos', icon: Video },
  { name: 'Films', href: '/dashboard/films', icon: Film },
  { name: 'Credentials', href: '/dashboard/settings', icon: Key },
]

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  
  // Handle mobile menu visibility
  useEffect(() => {
    // Close mobile sidebar when path changes
    setIsMobileOpen(false)
  }, [pathname])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isMobileOpen && !e.target.closest('.sidebar')) {
        setIsMobileOpen(false)
      }
    }

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isMobileOpen])

  return (
    <>
      {/* Mobile toggle button - visible only on mobile */}
      <button 
        className="fixed top-4 left-4 z-30 md:hidden bg-gray-900 text-white p-2 rounded-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop overlay for mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" />
      )}

      {/* Sidebar */}
      <div className={`sidebar fixed h-screen z-30 transform transition-all duration-300 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'w-16' : 'w-64'}
        md:flex`}
      >
        <div className="bg-[#1d1c21] text-white h-full flex flex-col shadow-lg">
          {/* Logo and collapse button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {!isCollapsed && (
              <Link href={'/'} className='p-3'>
                <img src='/ambient-light-logo.svg' alt="Logo" width={180} />
              </Link>
            )}
            
            
          </div>

          {/* Navigation items */}
          <nav className="flex-1 mt-6 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-3 mb-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <item.icon size={20} />
                  {!isCollapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                  {isActive && !isCollapsed && (
                    <span className="ml-auto w-1 h-5 bg-blue-300 rounded-full"></span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar