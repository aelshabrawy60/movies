import Navbar from '@/components/Navbar'
import UploadButton from '@/components/UploadButton'
import VideoGrid from '@/components/VideoGrid'
import React from 'react'

function page() {
  return (
    <>
        <Navbar/>
        <div className='p-8'>
            <div className='mb-4 flex justify-end'>
                <UploadButton/>
            </div>
            <VideoGrid/>
        </div>
    </>
  )
}

export default page