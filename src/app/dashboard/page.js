"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import UploadButton from '@/components/UploadButton'
import VideoGrid from '@/components/VideoGrid'
import Sidebar from '@/components/Sidebar'

function DashboardPage() {
  
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/videos')

  }, [])

  

  return (
    <>
      
    </>
  )
}

export default DashboardPage