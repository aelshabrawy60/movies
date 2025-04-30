"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()
  
    // Function to get a cookie value by name
  const getCookie = (name) => {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1)
      }
    }
    return null
  }

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = getCookie('authToken')
        
        if (!token) {
          // No token found, redirect to login
          router.push('/admin/login')
          return
        }

        // Validate token with API
        const response = await fetch('https://api.ambientlightfilm.net/api/verify-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const data = await response.json()

        if (data.status === 'success') {
          setUser(data.data)
          setIsLoading(false)
        } else {
          // Token validation failed, redirect to login
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Token validation error:', error)
        // Error during validation, redirect to login
        router.push('/admin/login')
      }
    }

    validateToken()
  }, [router])


  // Show loading state while validating token
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Validating your session...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Sidebar/>
      <div className="md:ml-[230px] bg-[#131217] min-h-screen">
        {children}
      </div>
    </>
  );
}
