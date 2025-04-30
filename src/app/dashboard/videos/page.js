"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import UploadButton from '@/components/UploadButton'
import VideoGrid from '@/components/VideoGrid'
import Sidebar from '@/components/Sidebar'

function DashboardPage() {
  
  return (
    <>
        <div className='p-8 space-y-8 w-full'>
          <div className='flex justify-end md:justify-start'>
            <UploadButton />
          </div>
          <VideoGrid />
        </div>
    </>
  )
}

export default DashboardPage